export function generateBookingCode() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK${timestamp}${random}`;
}