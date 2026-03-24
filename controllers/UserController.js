const User = require("../models/User");
const { hashPassword } = require("../utils/passwordUtils");
const { sendSuccess, sendError } = require('../utils/responseHandler');

async function addUser(req, res) {
  
    const { username, password, role_ids } = req.body;

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role_ids
    });
    return sendSuccess(res, "User created successfully", 400);
    
 
}

module.exports = { addUser };