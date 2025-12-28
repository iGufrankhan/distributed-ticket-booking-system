import nodemailer from "nodemailer";
import { GMAIL_USER, GMAIL_APP_PASSWORD } from "../../../utils/constant.js";
import { createTransporter } from "../../../utils/emailservices/createTransporter.js";

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (booking) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    to: booking.userEmail,
    subject: "🎟️ Booking Confirmed",
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Your booking ID: <b>${booking._id}</b></p>
      <p>Enjoy your show 🎬</p>
    `
  });
};

// Send payment failed email
export const sendPaymentFailedEmail = async (userEmail, bookingId) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    to: userEmail,
    subject: "❌ Payment Failed",
    html: `<p>Your payment for booking <b>${bookingId}</b> has failed.</p>`
  });
};
