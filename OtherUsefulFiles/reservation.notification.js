

const Notification = require('../Models/Notification')
const reservationNotification = async (reservationObj, driver_sub, userInfo, req, res) => {
    console.log("reservationObj", reservationObj);
  console.log(driver_sub, "driver_subdriver_subdriver_subdriver_subdriver_subdriver_sub");
  
    const createNotification = await Notification.create({
        driverId: driver_sub,
      pickUpPoint:   reservationObj.pickUpPoint,  
      destination: reservationObj.destination,  
      date: reservationObj.date,     
      userName: userInfo.name,
    userSurname: userInfo.surname,
    userPhone: userInfo.phone
    
    });
  
    console.log(
      "Notification created:",
      createNotification.pickUpPoint,
      createNotification.destination,
      createNotification.driverId,
      createNotification.userName,
      createNotification.userSurname,
      createNotification.userPhone
    );
  
    if (createNotification) {
      return createNotification;
    } else {
      console.log("Error occurred while sending reservation Notification");
    }
  };
  module.exports = reservationNotification

  