const express = require('express')
const walletCtrl = require('../Controllers/wallet.controller')
const checkAuthorization = require('../Middleware/check.auth')
const router = express.Router()
//create a wallet
// router.post('/createWallet', checkAuthorization, walletCtrl.createWallet)
//view Wallet
router.get('/myWallet', checkAuthorization, walletCtrl.viewWallet)
//recharge wallet
router.post('/transaction/recharge', checkAuthorization, walletCtrl.recharge)

// transactions
router.get('/transaction/result', walletCtrl.result)

router.all('/transaction/notify/:ref', walletCtrl.notify)

module.exports= router