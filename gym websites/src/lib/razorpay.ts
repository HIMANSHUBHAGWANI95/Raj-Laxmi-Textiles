import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

// Instantiate Razorpay only if key environment variables are set and not placeholders
export const isRazorpayConfigured = 
  keyId !== "" && 
  keySecret !== "" && 
  !keyId.includes("yourkeyhere") && 
  !keySecret.includes("yourkeyhere");

export const razorpay = isRazorpayConfigured 
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null;

/**
 * Format raw numbers into human readable Indian Rupee currency format (₹).
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generate a unique gym membership card number prefixed with 'ABF'.
 * Format: ABF-[YEAR][MONTH][DAY]-[4 RANDOM DIGITS] (e.g. ABF-20260624-9182)
 */
export function generateCardNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `ABF-${year}${month}${day}-${random}`;
}
