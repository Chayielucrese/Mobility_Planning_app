const { empty } = require("php-in-js/modules/types");
const User = require("../Models/user");
const { where } = require("sequelize");
const base64Img = require("base64-img");
const path = require("path");
const fs = require("fs");

const ProfileUpload = async (user, profileImage) => {
  const user_name = user.name;
  const user_surname = user.surname;

  const uploadDir = path.join(__dirname, "/../profileImages");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Function to validate base64 string
  const isValidBase64 = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      const base64Pattern =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
      return base64Pattern.test(str);
    } catch (err) {
      return false;
    }
  };

  const correctBase64Format = (base64Data) => {

    if (!base64Data.startsWith("data:image/")) {
      base64Data = `data:image/jpeg;base64,${base64Data}`;
    }

    // Split the data URI and validate the base64 content
    const parts = base64Data.split(",");
    if (parts.length === 2 && isValidBase64(parts[1])) {
      return base64Data;
    }

    // If the content is invalid, attempt to reformat it
    const base64Content = parts.pop(); // Get the base64 part
    if (isValidBase64(base64Content)) {
      return `${parts.join(",")},${base64Content}`; // Rejoin the valid parts
    }

    // Return the corrected data URI if possible
    return base64Data;
  };

  const saveImage = (base64Data, fileName) => {
    return new Promise((resolve, reject) => {
    
      base64Data = correctBase64Format(base64Data);

      const base64Content = base64Data.split(",")[1];
      if (!isValidBase64(base64Content)) {
        return reject(new Error("Invalid base64 image data: Incorrect format"));
      }

      base64Img.img(base64Data, uploadDir, fileName, (err, filePath) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  };

  try {
    const [imageProfilePath] = await Promise.all([
      saveImage(profileImage, `${user_name} ${user_surname} profile`),
    ]);

    const was_updated = await User.update(
      {
        profileImage: imageProfilePath.split('profileImages')[1],
      },
      {
        where: { id: user.id },
      }
    );

    if (!was_updated) {
      return { status: 400, data: { msg: "Failed to update" } };
    }
    return {
      status: 200,
      data: {
        success: "user updated suceessfully",
      },
    };
  } catch (error) {
    console.error("Error saving images:", error);
    return {
      status: 500,
      data: { msg: "Internal server error" },
    };
  }
};

module.exports = ProfileUpload;
