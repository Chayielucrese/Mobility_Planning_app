
const { empty } = require("php-in-js/modules/types");
const User = require("../Models/user")
const monetbil = require('../services/monetbil');
const _processTransaction = require("./transactionController");

//create Wallet
// exports.createWallet = async (req, res) => {
//   try {
//     const userObj = req.user;
//     const { password } = req.body;
//     console.log(password, "my pwd");

//     if (!(await wallet.findOne({ where: { userId: userObj.id } }))) {
//       if (empty(password) || !password || isNaN(password)) {
//         return res
//           .status(400)
//           .json({ msg: "Password must be a numeric value." });
//       }

//       if (password.length < 5 || password.length > 5) {
//         return res.status(400).json({
//           msg: "Your PIN code must be 5 numbers long",
//         });
//       }
//       if (
//         !(await wallet.create({
//           userId: userObj.id,
//           currentBalace: 0,
//           walletPassword: bcrypt.hashSync(password, 10),
//         }))
//       ) {
//         return res
//           .status(400)
//           .json({ msg: "An error occured while creating wallet" });
//       } else {
//         return res.status(201).json({ msg: "wallet created successfully" });
//       }
//     } else {
//       return res.status(409).json({ msg: "you already have a wallet" });
//     }
//   } catch (err) {
//     console.log("error", err);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// };
// //View Wallet
exports.viewWallet = async (req, res) => {
  try {
    const userObj = req.user;
    // const { password } = req.body;

    // if (empty(password)) {
    //   return res.status(400).json({
    //     msg: "Enter the password to your wallet",
    //   });
    // }
    const my_wallet = await User.findOne({ where: { userId: userObj.id } }, {attribute: ["balance"]});


      return res
        .status(200)
        .json({  currentBalance: my_wallet.balance  });
  
  } catch (err) {
    console.error("Error viewing wallet: ", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
//Recharge Wallet
exports.recharge = async(req, res) => {
  const { amount } = req.body 

  if (empty(amount) || !parseInt(amount)) {
      res.status(400).json({msg:'Please enter a valid amount to charge'})
  }
  if (amount < 2) {
      res.status(400).json({msg:'You cannot charge less than 100 FCFA'})
  }
  console.log("can't enter here");

  try {

    const payment_url = await monetbil.initPayment({
      amount,
      fee: Math.ceil(0.01 * amount),
      userId: req.user.id,
    });
    console.log("Entered successfully");
    return res.status(201).json({ msg: 'Payment initiated successfully', payment_url });
  } catch (e) {
    console.error("Error occurred:", e);
    return res.status(500).json({ msg: e.message || 'An error occurred while initiating payment' });
  }
      
      
  }



exports.result = async(req, res) => {
  const { payment_ref, status, message, transaction_id } = req.query
 

  if(!empty(payment_ref) && !empty(transaction_id)){
    await _processTransaction(payment_ref, transaction_id)
  }

  if (status === 'cancelled') {
      // monetbil.removeRef(payment_ref)
  }

  return res.render('transactions/result', { 
      status,
      message: message || ''
  })
}


/**
 * This route is automatically call by monetbil when everything is ok
 * So, she permit to update a balance of the user if payment is done
 * 
 * @internal It is not a real api route. is only use by monetbil
 * @see monetbilservice file: /services/monetbil.js line: 46
 */
exports.notify = async (req, res) => {
   const { ref }            = req.params
   const { transaction_id } = req.query

   const result = await _processTransaction(ref, transaction_id)
   
   switch (result) {
       case 'GONE': return res.status(401).json("gone")
       case 'FOUND': return res.status(200).json("found")
       case 'FORBIDDEN': return res.status(403).json("Forbidden")
       case 'UNAUTHORIZED': return res.status(403).json("Unauthorized")
       default: return res.ok();
   }
}
