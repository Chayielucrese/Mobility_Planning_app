const notification = async (userid, req, res) => {
  const subject = `eTravel Etravel Update`;
  const content = `congratulations  ${userid.name} your documents has been verified and approved successfully`;

  const new_not = await Notification.create({
    subject: subject,
    userId: userid,
    content: content,
  });
  return res
    .status(201)
    .json({ msg: "Notification send successfully", new_not });
};

module.exports = notification