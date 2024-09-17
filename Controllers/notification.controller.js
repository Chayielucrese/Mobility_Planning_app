const { empty } = require("php-in-js/modules/types");
const Notification = require("../Models/Notification");
const { Op } = require("sequelize");
const { ONE_SIGN_CONFIG } = require("../NotificationConfig/app.config");
const PushNotificationService = require("../services/push_notification_services");
const { result } = require("./wallet.controller");

exports.createNotification = async (req, res) => {
  try {
    const { message, userId, subject } = req.body;
    await Notification.create({
      userId: userId,
      content: message,
      subject: subject,
    });

    io.emit(`notification_${userId}`, { subject }, { message });
    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.retrieveNotification = async (req, res) => {
  const get_driver_notification = await Notification.findAll({
    where: {
      driverId: req.user.id,
    },
  });

  if (empty(get_driver_notification)) {
    return res.status(200).json({ msg: "No Notification yet" });
  }
  return res.status(200).json({ Notifications: get_driver_notification });
};

exports.SendNotificationsToUsersDevice = (req, res, next) => {
  var message = {
    app_id: ONE_SIGN_CONFIG.APP_ID,
    contents: { en: "Test Push Notification" },
    included_segments: ["included_player_ids"],
    include_player_ids: req.body.devices,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "Custom Notification",
    },
  };
  PushNotificationService.SendNotification(message, (error, result) => {
    if (error) {
      console.log(error, "error occured");
      return res.status(400).json({ msg: "invalid response" });
    } else {
      return res.status(200).json({ msg: "success", data: result });
    }
  });
};
