
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { sendNewsletterSubscriptionConfirmation } from "../../services/newletter/newsletter.service.js";

// Subscribe
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { newsletterSubscribed: true }, { new: true });
  if (user && user.email) {
    await sendNewsletterSubscriptionConfirmation(user.email);
  }
  res.json({ success: true, message: "Subscribed to newsletter! Confirmation email sent." });
});

// Unsubscribe
export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { newsletterSubscribed: false });
  res.json({ success: true, message: "Unsubscribed from newsletter." });
});