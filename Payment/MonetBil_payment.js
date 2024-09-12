const Transaction = require("../Models/transaction");
const axios = require("axios"); // Ensure axios is imported
const API_KEY = require("./API_KEY");
const SERVICE_KEY = require("./SERVICE_KEY");
const url = require('../Front_url/image_url_front')

const PerformPayment = async (amount) => {
  const secret_key = SERVICE_KEY;
  const version = "v2.1";
  const country = "CM";
  const logo =
    "https://github.com/Chayielucrese/mobility_planning_version4/blob/master/lib/logo/etravel.png?raw=true"; // Logo URL

  try {
    const response = await axios.post(
      `https://api.monetbil.com/widget/${version}/${secret_key}`,
      {
        amount: amount,
        logo: logo,
        currency: "XAF",
        country: country,
        return_url: url + ":9000/api/cancel"
      }
    );

    console.log("Payment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error performing payment:", error);
    throw error;
  }
};

module.exports = PerformPayment;
