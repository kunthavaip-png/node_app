const User = require("../models/User");
const Role = require("../models/Role");
const Menu = require("../models/Menu");
const RoleMenuMapping = require("../models/RoleMenuMapping");
const { comparePassword } = require("../utils/passwordUtils");
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { generateToken } = require("../config/token");

exports.login = async (req, res) => {
  
    const { username, password } = req.body;

    
    const user = await User.findOne({username,deletedAt: null}).populate("role_ids");

    if (!user) {
        return { status: false, message: "Invalid username", data: null };     
    }    
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return { status: false, message: "Invalid password", data: null };
    }
    const roleIds = user.role_ids.map(role => role._id); 
    const menuMappings = await RoleMenuMapping.find({ roleId: { $in: roleIds } }).populate("menuId");

    // Extract menu objects and remove duplicates
    const menus = menuMappings.map(m => m.menuId);   

    const token = await generateToken({ id: user._id,roleIds});
     const userData = {
      userId: user._id,
      username: user.username,
      roleIds,
      menus,
      token
    };
      sendSuccess(res, 'Login successfully',200,userData );
    
    
    

  
};