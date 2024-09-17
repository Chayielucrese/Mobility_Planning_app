const opencage = require('opencage-api-client');
const OPEN_CAGE_API = require('../config/Open_Cage_Api');
exports.geocodeAddressToCoordinates = async (address) => {
    const apiKey = OPEN_CAGE_API;

    try {
        const data = await opencage.geocode({ q: address, key: apiKey });

        // Log the full response to view the geometry object
        console.log('OpenCage API Response:', JSON.stringify(data, null, 2));

        if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0]; // Get the first result
            const { lat, lng } = place.geometry; // Extract latitude and longitude
            console.log(`Coordinates for ${address}:`, { lat, lng }); // Log the coordinates
            return { lat, lng }; // Return the coordinates
        } else {
            throw new Error(`No results found or API status: ${data.status.message}`);
        }
    } catch (error) {
        console.error('Error during geocoding:', error.message);

        if (error.status === 402) {
            console.log('Hit free trial daily limit');
            console.log('Become a customer: https://opencagedata.com/pricing');
        }

        // Return null or handle the error as needed
        return null;
    }
};



// // Example usage of the function
// (async (req, res) => {
//     const coordinates = await exports.geocodeAddressToCoordinates('Nouvelle route Bastos, Yaoundé, Carrefour BIYEM-ASSI, Yaoundé, Cameroon');
//     console.log('Coordinates:', coordinates); 
  
// })();
