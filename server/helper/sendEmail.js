const nodemailer = require("nodemailer");
const { userName, userPass } = require("../secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: userName,
        pass: userPass,
    },
});

// send mail with defined transport object
const emailWithNodeMailer = (emailData) => {
  try {
    const mailOptions = {
      from: '"Facebook" <sajibshikder78971@gmail.com>',
      to: emailData.email,
      subject: emailData.subject,
      text: "Facebook",
      html: emailData.html,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`This error is form sendMailjs :`, error.message);
    throw error;
  }
};

module.exports = { emailWithNodeMailer };
