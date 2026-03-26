const User = require("../models/User");
const Role = require("../models/Role");
const { hashPassword } = require("../utils/passwordUtils");
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { createSchema, updateSchema } = require("../validators/userValidator");
const mongoose = require('mongoose');
const redisClient = require("../config/redis");
const addUser = async (req, res) => {
  const { error } = createSchema.validate(req.body);
  if (error) {
    return sendError(res, error.details[0].message, 400);
  }

  const mobileValidation = await User.findOne({ phone: req.body.phone, deleted_at: null });
  if (mobileValidation) {
    return sendError(res, "Phone number is already registered", 400);
  }
  if(req.body.email){
    const emailValidation = await User.findOne({ email: req.body.email, deleted_at: null });
    if (emailValidation) {
      return sendError(res, "Email is already registered", 400);
    }
  }
  const roles = await Role.findOne({ _id: { $in: req.body.role_ids } }).sort({ priority: 1 });
  if (!roles) {
    return sendError(res, "Roles not found", 400);
  }  
  req.body.password = await hashPassword(req.body.password);
  
  const user = await User.create(req.body);  
  return sendSuccess(res, "User created successfully", 200);
};
const updateUser = async (req, res) => {
  const { id } = req.params;
//return sendSuccess(res, "sc", 400,id);
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return sendError(res, error.details[0].message, 400);
  }

  const user = await User.findById(id);
  if(!user){
    return sendError(res, "User not found", 404);
  }

  const mobileValidation = await User.findOne({ phone: req.body.phone, deleted_at: null, _id: { $ne: id } });
  if (mobileValidation) {
    return sendError(res, "Phone number is already registered", 400);
  }

  if(req.body.email){
    const emailValidation = await User.findOne({ email: req.body.email, deleted_at: null, _id: { $ne: id } });
    if (emailValidation) {
      return sendError(res, "Email is already registered", 400);
    }
  }

  const roles = await Role.findOne({ _id: { $in: req.body.role_ids } }).sort({ priority: 1 });
  if (!roles) {
    return sendError(res, "Roles not found", 400);
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedUser) {
    return sendError(res, "User not found", 404);
  }

  return sendSuccess(res, "User updated successfully", 200);
};
const listUser = async (req, res) => {
  const { search, roles, page = 1, limit = 10 } = req.body;
  const user = req.user;
  const roleIds = (roles || []).filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
  const cacheKey = `users:${search || ""}:${page}:${limit}:${(roles || []).join(",")}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {   

    return sendSuccess(res, "User list fetched successfully from redis", 200, JSON.parse(cachedData));
  }
  const pipeline = [
    
    {
      $match: {
        deleted_at: null,
        ...(roleIds?.length
          ? { role_ids: { $in: roleIds } }
          : {})
      }
    },
    {
      $lookup: {
        from: "roles",
        let: { roleIds: "$role_ids" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$roleIds"] },
              deleted_at: null
            }
          }
        ],
        as: "rolesData"
      }
    },
    
    {
      $match: {               
        ...(search
          ? {
              $or: [
                { username: { $regex: search || '', $options: "i" } },
                { phone: { $regex: search || '', $options: "i" } },                
                { "rolesData.name": { $regex: search || '', $options: "i" } }
              ],
            }
          : {})
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $skip: (page - 1) * Number(limit)
    },
    {
      $limit: Number(limit)
    },
    {
      $project: {
        username: 1,
        email: 1,
        phone: 1,        
        roles: {
          $map: {
            input: "$rolesData",
            as: "role",
            in: {
              _id: "$$role._id",
              name: "$$role.name"
            }
          }
        }
      }
    }
  ];

  const countPipeline = [...pipeline];
  countPipeline.splice(-3); 
  countPipeline.push({ $count: "total" });

  const [users, [countResult]] = await Promise.all([
    User.aggregate(pipeline),
    User.aggregate(countPipeline)
  ]);

  const total = countResult ? countResult.total : 0;
  const totalPages = Math.ceil(total / limit);
  const responseData = {
    list: users,
    current_page: Number(page),
    total_pages: totalPages,
    total_records: total,
  };
  await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

  sendSuccess(res, "User list fetched successfully", 200, {
    list: users,
    current_page: Number(page),
    total_pages: totalPages,
    total_records: total,
  });
};


module.exports = { addUser,updateUser,listUser };