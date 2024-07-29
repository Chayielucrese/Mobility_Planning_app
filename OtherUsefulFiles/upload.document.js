const { empty } = require("php-in-js/modules/types");
const user = require("../Models/user");
const { where } = require("sequelize");
const base64Img = require("base64-img");

const uploadDocument = async (
  id,
  CNI,
  drivingLicense,
  vehicleReg,
  vehiclePhoto,
  profileImage,
  
) => {
  const user_name = await user.findAll(
    { attribute: ["name"] },
    { where: { id } }
  );

  var CNIPath = base64Img.imgSync(
    CNI,
    __dirname + "/../Uploads",
    `${user_name}`
  );
  var drivingLicensePath = base64Img.imgSync(
    drivingLicense,
    __dirname + "/../Uploads",
    `${user_name}`
  );
  var vehicleRegPath = base64Img.imgSync(
    vehicleReg,
    __dirname + "/../Uploads",
    `${user_name}`
  );
  var vehiclePhotoPath = base64Img.imgSync(
    vehiclePhoto,
    __dirname + "/../Uploads",
    `${user_name}`
  );
  var profileImagePath = base64Img.imgSync(
    profileImage,
    __dirname + "/../Uploads",
    `${user_name}`
  );

  const was_updated = await user.update(
    {
      CNI: CNIPath,
      drivingLicense: drivingLicensePath,
      vehicleReg: vehicleRegPath,
      vehiiclePhoto: vehiclePhotoPath,
      profileImage: profileImagePath,
    },
    {
      where: { id },
    }
  );
  

  if (!was_updated) {
    return {status:400,data:{ msg: "fail to update" }}
  }
  console.log("update successful");
  return { status: 200, data: { success: "A code has been send to your email to activate your account" } };
};
module.exports = uploadDocument;
