import { User } from "../../models/user.models.js";
import { createTransporter } from "../../../utils/emailservices/createTransporter.js";

export const sendNewsletter = async (subject, html) => {
  const users = await User.find({ newsletterSubscribed: true }, "email");
  const transporter = createTransporter();
  for (const user of users) {
    await transporter.sendMail({
      to: user.email,
      subject,
      html,
    });
  }
};

export const sendNewsletterSubscriptionConfirmation = async (userEmail) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    to: userEmail,
    subject: "Newsletter Subscription Confirmed",
    html: `<h2>Thank you for subscribing to our newsletter!</h2><p>You will now receive updates and offers from us.</p>`,
  });
};