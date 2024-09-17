const { json } = require('body-parser');
const { ONE_SIGN_CONFIG } = require('../NotificationConfig/app.config');

async function SendNotification(data, callback) {
    var headers = {
        "Content-type": "application/json; charset=utf-8",
        "Authorization": "Basic " + ONE_SIGN_CONFIG.API_KEY
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",  // Correct path
        method: "POST",
        headers: headers
    };

    var https = require('https');

    var req = https.request(options, function(res) {
        let responseData = '';

        // Accumulate data chunks
        res.on('data', function(chunk) {
            responseData += chunk;
        });

        // Handle the end of the response
        res.on('end', function() {
            try {
                // Attempt to parse the data as JSON
                const jsonData = JSON.parse(responseData);
                console.log(jsonData);
                return callback(null, jsonData);
            } catch (e) {
                console.error('Error parsing JSON:', e.message);
                console.error('Raw Response:', responseData);
                return callback({
                    msg: 'Invalid JSON response',
                    rawResponse: responseData
                });
            }
        });
    });

    req.on('error', function(e) {
        return callback({ msg: e.message });
    });

    // Send the data
    req.write(JSON.stringify(data));
    req.end();
}

module.exports = { SendNotification };
