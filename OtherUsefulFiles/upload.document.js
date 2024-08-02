const { empty } = require("php-in-js/modules/types");
const user = require("../Models/user");
const { where } = require("sequelize");
const base64Img = require("base64-img");
const path = require("path");
const fs = require("fs");

const uploadDocument = async (
  id,
  CNI,
  drivingLicense,
  vehiclePhoto,
  profileImage
) => {
  console.log(CNI, "CNI Base64 Data");
  const u = await user.findByPk(id);
  const user_name = u.name;
  console.log(u.id, "user id");

  const uploadDir = path.join(__dirname, '/../Uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Function to validate base64 string
  const isValidBase64 = (str) => {
    if (typeof str !== 'string') {
      return false;
    }
    try {
      const base64Pattern = /^(?:[A-Z0-9+/]{4})*?(?:[A-Z0-9+/]{2}(?:==)?|[A-Z0-9+/]{3}=?)?$/i;
      return base64Pattern.test(str);
    } catch (err) {
      return false;
    }
  };

  const saveImage = (base64Data, fileName) => {
    return new Promise((resolve, reject) => {
      // Log the base64 data
      console.log(`Saving image for ${fileName} with data: ${base64Data.substring(0, 30)}...`);

      // Add prefix if missing
      if (!base64Data.startsWith('data:image/')) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
      }

      const base64Content = base64Data.split(',')[1];
      if (!isValidBase64(base64Content)) {
        return reject(new Error('Invalid base64 image data: Incorrect format'));
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
    const [CNIPath, drivingLicensePath, vehiclePhotoPath, profileImagePath] = await Promise.all([
      saveImage(CNI, `${user_name} CNI`),
      saveImage(drivingLicense, `${user_name} drivingLicense`),
      saveImage(vehiclePhoto, `${user_name} vehiclePhoto`),
      saveImage(profileImage, `${user_name} profileImage`)
    ]);

    const was_updated = await user.update(
      {
        CNI: CNIPath,
        drivingLicense: drivingLicensePath,
        vehiclePhoto: vehiclePhotoPath,
        profileImage: profileImagePath,
      },
      {
        where: { id: u.id },
      }
    );

    if (!was_updated) {
      return { status: 400, data: { msg: "Failed to update" } };
    }

    console.log("Update successful", CNIPath, drivingLicensePath, vehiclePhotoPath, profileImagePath);
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

module.exports = uploadDocument;
