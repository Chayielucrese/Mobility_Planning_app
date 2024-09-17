const { Op } = require("sequelize");
const UserSubscription = require("../Models/UserSubscription");
const { subscribe } = require("../Routes/user.routes.js");

// Middleware or a scheduled job to check if a subscription has expired
const checkSubscriptionValidity = async (req, res, next) => {
    const user_id = req.user
    console.log("helloooo");
  
    try {
   
      const subscription = await UserSubscription.findOne({
        where: {
          userId: user_id.id,
          endDate: { [Op.gt]: new Date() }, // Check if the end date is greater than the current date
        },
      });
      
 
      if (!subscription) {
        return res.status(400).json({
          msg: "You do not have an active subscription.",
        });
      }
  
      next(); // If valid, allow access to the requested route
    } catch (error) {
      return res.status(500).json({
        msg: "Error checking subscription validity.",
      });
    }
  };
  module.exports = checkSubscriptionValidity