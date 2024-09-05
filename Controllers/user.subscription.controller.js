


const Reservationtypes = require("../Models/reservationtypes");
const UserSubscription = require("../Models/UserSubscription");
const Wallet = require("../Models/Wallet");

exports.UserPerformsubscription = async (req, res) => {
  const userobj = req.user;
  const subscription_id = req.params.subscription_id;


  try {
    // Verify if user has a wallet
    const find_user_wallet = await Wallet.findOne({
      where: { userId: userobj.id },
    });

    if (!find_user_wallet) {
      return res.status(400).json({
        msg: "You are required to create and recharge a wallet before the transaction can proceed.",
      });
    }

    // Check if the wallet balance is 0
    if (parseFloat(find_user_wallet.currentBalance) === 0) {
      return res.status(400).json({
        msg: "Your account is currently empty. Please recharge your wallet to proceed.",
      });
    }

    // Fetch the subscription price
    const subscriptionPlan = await Reservationtypes.findOne({
      where: { id: subscription_id },
    });

    if (
      parseFloat(find_user_wallet.currentBalance) >=
      parseFloat(subscriptionPlan.price)
    ) {
      // Deduct the amount from wallet and create the subscription
      const new_subscription = await UserSubscription.create({
        userId: userobj.id,
        subscriptionId: subscription_id,
        paymentMode: "wallet",
        paymentStatus: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Set end date to 30 days later
        duration: 30,
      });

      if (!new_subscription) {
        return res.status(500).json({
          msg: "An error occurred while creating the subscription.",
        });
      }

      return res.status(201).json({
        msg: "Your subscription was created successfully and is valid for 30 days.",
      });
    } else {
      return res.status(400).json({
        msg: "Your current wallet balance is insufficient for this subscription.",
      });
    }
  } catch (error) {
    console.error("Error performing subscription:", error);
    return res.status(500).json({
      msg: "An internal error occurred while processing your subscription.",
    });
  }
};
