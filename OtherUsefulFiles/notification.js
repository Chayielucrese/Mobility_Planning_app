
const Notification = require('../Models/Notification')
const notification = async (driver, req, res) => {
    try {
      const subject = `eTravel Update`;
      const content = `Congratulations ${driver.name} ${driver.surname}, your documents have been verified and approved successfully.`;
  
      const newNotification = await Notification.create({
        subject: subject,
        userId: driver.id,
        content: content,
      });
      console.error( "Notification sent successfully", newNotification);
     
    } catch (error) {
      console.error('Error creating notification:', error);
        }
  };
  
  module.exports = notification;
  

 