const express = require('express')
const walletCtrl = require('../Controllers/wallet.controller')
const checkAuthorization = require('../Middleware/check.auth')
const { default: axios } = require("axios")
const { baseUrl } = require("../config/env")
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
router.get('/test-api', async (req, res) => {
    try {
      const { data: response } = await axios.post('YOUR_API_ENDPOINT', {
        amount: 100,
        locale: 'en',
        country: 'CM',
        currency: 'XAF',
        payment_ref: 'test_ref',
        return_url: `${baseUrl}/api/transaction/result`,
        notify_url: `${baseUrl}/api/transaction/notify/test_ref`,
        logo: "https://github.com/Chayielucrese/mobility_planning_version4/blob/master/lib/logo/etravel.png?raw=true" // Logo URL
      }, { timeout: 5000 }); // Add timeout to prevent indefinite hanging
  
      // Log the successful response for debugging
      console.log("Response from API:", response);
  
      // Return success response
      res.status(200).json(response);
  
    } catch (error) {
      // Enhanced error handling
      console.error("Error during isolated test request:", error.message || error);
  
      // Check if the error is an axios error
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        res.status(500).json({ msg: 'Test failed', error: error.response.data });
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
        res.status(500).json({ msg: 'Test failed', error: 'No response received from the API' });
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
        res.status(500).json({ msg: 'Test failed', error: error.message });
      }
    }
  });
  

module.exports= router