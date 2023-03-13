const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "viktoriia.ostrojinskaya@gmail.com" };
    await sgMail.send(email);
    return true;
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
