const { empty } = require("php-in-js/modules/types");
const notification = require("../Models/Notification");
const Role = require("../Models/role");

exports.createNotification = async (req, res) => {
  try {
    const { message, userId, subject } = req.body;
    await Notification.create({
      userId: userId,
      content: message,
      subject: subject,
    });

    io.emit(`notification_${userId}`, { subject }, {message});
    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
