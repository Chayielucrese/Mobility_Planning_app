
const { empty } = require("php-in-js/modules/types");

exports.getPlaces = async (req, res) => {
    API_KEY ="8c402c3fd88243f9be613d7ed4047318";
  const { myText } = req.body;
  if (empty(myText)) {
    return res.status(400).json({ msg: "Please enter a text" });
  }

  // Dynamically import node-fetch
  const fetch = (await import('node-fetch')).default;

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${myText}&format=json&apiKey=${API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    return res.json({ places: data });
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({ msg: "Error fetching places" });
  }
};
