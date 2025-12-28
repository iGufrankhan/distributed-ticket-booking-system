// controllers/admin/newsletter.controllers.js
import { sendNewsletter } from "../../services/newletter/newsletter.service.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

export const sendNewsletterHandler = asyncHandler(async (req, res) => {
  const { subject, html } = req.body;
  await sendNewsletter(subject, html);
  res.json({ success: true, message: "Newsletter sent to all subscribers." });
});