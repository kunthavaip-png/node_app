const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/responseHandler");

function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      // Get token from header
      console.log("Authorization header:", req.headers.authorization);
      
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
      console.log("Token extracted:", token);
      if (!token) {
        return sendError(res, 'Unauthorized.', 403);
        
      }
      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      // Fetch user and populate roles
      const user = await User.findById(req.userId).populate("role_ids"); 
          
      // role_ids now contains full role documents

      // Check if any of user's roles is in allowedRoles
      const userRoleNames = user.role_ids.map(r => r.name); // or r.code if you have a code field
      const hasRole = userRoleNames.some(roleName => allowedRoles.includes(roleName));

      if (!hasRole){
        return sendError(res, 'Not allowed to access this page.', 403);
      }

      req.userRoles = userRoleNames;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

module.exports = authorizeRoles;