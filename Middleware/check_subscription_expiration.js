const UserSubscription = require("../Models/UserSubscription");

// Middleware or a scheduled job to check if a subscription has expired
exports.checkSubscriptionValidity = async (req, res, next) => {
    const user_id = req.user
  
    try {
      // Find the active subscription for the user
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
  