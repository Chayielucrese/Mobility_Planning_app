const { empty } = require("php-in-js/modules/types");
const Vehicle = require("../Models/vehicle");
const { where } = require("sequelize");
const base64Img = require("base64-img");
const path = require("path");
const fs = require("fs");

const VehicleOwnerUpload = async (
  user,
  vehicleInsurCert,
  vehicleRoadWthRep,
  vehicleRegCert,
  vehicleSalescert
) => {
  const user_name = user.name;
  const user_surname = user.surname;

  const uploadDir = path.join(__dirname, "/../Vehicles");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Function to validate base64 string
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
    const [
      vehicleInsurCertPath,
      vehicleRegCertPath,
      vehicleRoadWthRepPath,
      vehicleSalescertPath,
    ] = await Promise.all([
      saveImage(vehicleRoadWthRep, `${user_name} ${user_surname} VehicleRegistrationworthinessreport`),
      saveImage(vehicleRegCert, `${user_name} ${user_surname} VehicleRegistrationcertificate`),
      saveImage(vehicleInsurCert, `${user_name} ${user_surname} VehicleInsurancecertificate`),
      saveImage(vehicleSalescert, `${user_name} ${user_surname} VehicleSalescertificate`),
    ]);

    const was_updated = await Vehicle.update(
      {
        vehicleRegistrationCertificate: vehicleRegCertPath.split("Vehicles")[1],
        vehicleInsuranceCertificate: vehicleInsurCertPath.split("Vehicles")[1],
        vehicleSalesCertificate: vehicleSalescertPath.split("Vehicles")[1],
        vehicleRoadWorthinessReport: vehicleRoadWthRepPath.split("Vehicles")[1],
      },
      {
        where: { owner: user.id },
      }
    );
console.log(user.email, user.id);

    if (!was_updated) {
      return { status: 400, data: { msg: "Failed to update" } };
    }
    return {
      status: 200,
      data: {
        success: "vehicle updated suceessfully",
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

module.exports = VehicleOwnerUpload;
