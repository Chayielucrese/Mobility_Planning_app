const Reservationtypes = require("../Models/reservationtypes");
const UserSubscription = require("../Models/UserSubscription");

const User = require("../Models/user");
const { Op } = require("sequelize");
const monetbil = require("../services/monetbil");

exports.UserPerformsubscription = async (req, res) => {
  const userObj = req.user;
  const subscriptionId = req.params.subscriptionId;

  try {
    const userWallet = await User.findOne(
      {
        where: { id: userObj.id },
      },
      { attibutes: ["balance"] }
    );

    if (userWallet.balance === 0) {
      return res.status(400).json({
        msg: "Your current balance is 0 FCFA. Please recharge to proceed.",
      });
    }

    const subscriptionPlan = await Reservationtypes.findOne({
      where: { id: subscriptionId },
    });

    if (!subscriptionPlan) {
      return res.status(404).json({
        msg: "Subscription plan not found.",
      });
    }

    const subscriptionPrice = parseInt(subscriptionPlan.price);
    const currentBalance = parseInt(userWallet.balance);

    console.log(subscriptionPrice, "subscriptionPrice", currentBalance);
    

    if (currentBalance >= subscriptionPrice) {


      const widrawalFromSubscriptionWallet =  monetbil.send({
        amount : subscriptionPrice,
        phone: "678338191"

      })
if(widrawalFromSubscriptionWallet){
    const newSubscription = await UserSubscription.create({
        userId: userObj.id,
        subscriptionId: subscriptionId,
        paymentMode: "wallet",
        paymentStatus: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Valid for 30 days
        duration: 30,
      });

      if (!newSubscription) {
        return res.status(500).json({
          msg: "An error occurred while creating the subscription.",
        });
      }

      await User.update({ balance: newBalance }, { where: { id: userObj.id } });

      await User.update({ subscription: true }, { where: { id: userObj.id } });
      return res.status(201).json({
          msg: "Subscription successfully created. It is valid for 30 days.",
        });
}




      // const widrawalFromSubscriptionWallet = await monetbil.send
      // const newBalance = currentBalance - subscriptionPrice;

      // const newSubscription = await UserSubscription.create({
      //   userId: userObj.id,
      //   subscriptionId: subscriptionId,
      //   paymentMode: "wallet",
      //   paymentStatus: true,
      //   startDate: new Date(),
      //   endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Valid for 30 days
      //   duration: 30,
      // });

      // if (!newSubscription) {
      //   return res.status(500).json({
      //     msg: "An error occurred while creating the subscription.",
      //   });
      // }

      // await User.update({ balance: newBalance }, { where: { id: userObj.id } });

      // await User.update({ subscription: true }, { where: { id: userObj.id } });

      // return res.status(201).json({
      //   msg: "Subscription successfully created. It is valid for 30 days.",
      // });
    } else {
      return res.status(400).json({
        msg: "Insufficient wallet balance for this subscription.",
      });
    }
  } catch (error) {
    console.error("Error performing subscription:", error);
    return res.status(500).json({
      msg: "An internal error occurred while processing your subscription.",
    });
  }
};

//view reservation details

exports.viewSubsriptionDetails = async (req, res) => {
  const user_subscription = await UserSubscription.findAll({
    where:{ userId: req.user.id}, 
  });
  console.log(user_subscription.length, "user_subscriptionuser_subscriptionuser_subscription");
  
  if(user_subscription){
    const subscription_details = await Reservationtypes.findOne({where: {id: user_subscription[0].subscriptionId}})
    if(subscription_details){
      return res.status(200).json({msg: subscription_details[0]})
    }
    return res.status(404).json({msg:"can't find subscriptiong matching our data"})
  }
};
