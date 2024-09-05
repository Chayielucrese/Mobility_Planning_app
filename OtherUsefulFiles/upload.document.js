const { empty } = require("php-in-js/modules/types");
const user = require("../Models/user");
const base64Img = require("base64-img");
const path = require("path");
const fs = require("fs");

const UploadDocument = async (
  id,
  profileImage,
  drivingLicense,
  CNI,
  vehiclePhoto
) => {
  const u = await user.findByPk(id);
  const user_name = u.name;
  console.log(u.id, "user id");

  const uploadDir = path.join(__dirname, "/../Uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Function to validate base64 structure and data
  const isValidBase64Data = (base64Data) => {
    if (typeof base64Data !== "string") return false;
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    const parts = base64Data.split(",");

    // Ensure there are exactly 2 parts
    if (parts.length !== 2) return false;

    // Check that the first part is a valid data URI scheme
    if (!parts[0].startsWith("data:image/")) return false;

    // Validate the actual base64 content (second part)
    return base64Regex.test(parts[1]);
  };

  const correctBase64Format = (base64Data) => {
    if (typeof base64Data !== "string") {
      throw new Error("Invalid base64 image data: Not a string");
    }

    // Add default prefix if missing
    if (!base64Data.startsWith("data:image/")) {
      base64Data = `data:image/jpeg;base64,${base64Data}`;
    }

    // Ensure the format is valid before proceeding
    if (!isValidBase64Data(base64Data)) {
      throw new Error("Invalid base64 image data: Incorrect structure or content");
    }

    return base64Data;
  };

  const saveImage = (base64Data, fileName) => {
    return new Promise((resolve, reject) => {
      try {
        base64Data = correctBase64Format(base64Data);

        base64Img.img(base64Data, uploadDir, fileName, (err, filePath) => {
          if (err) {
            reject(err);
          } else {
            resolve(filePath);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const [CNIPath, drivingLicensePath, vehiclePhotoPath, profileImagePath] =
      await Promise.all([
        saveImage(profileImage, `${user_name}_profileImage`),
        saveImage(CNI, `${user_name}_CNI`),
        saveImage(drivingLicense, `${user_name}_drivingLicense`),
        saveImage(vehiclePhoto, `${user_name}_vehiclePhoto`),
      ]);

    const was_updated = await user.update(
      {
        profileImage: profileImagePath.split("Uploads")[1],
        CNI: CNIPath.split("Uploads")[1],
        drivingLicense: drivingLicensePath.split("Uploads")[1],
        vehiclePhoto: vehiclePhotoPath.split("Uploads")[1],
      },
      {
        where: { id: u.id },
      }
    );

    if (!was_updated) {
      return { status: 400, data: { msg: "Failed to update" } };
    }

    return {
      status: 200,
      data: {
        success: "A code has been sent to your email to activate your account",
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

module.exports = UploadDocument;
