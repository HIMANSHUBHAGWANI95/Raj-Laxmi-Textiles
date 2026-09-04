import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const isRazorpayConfigured =
  !!keyId &&
  !!keySecret &&
  keyId !== "rzp_test_yourkeyhere" &&
  keySecret !== "rzp_test_yourkeyhere" &&
  keySecret !== "rzp_test_yoursecrethere";

export const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!,
    })
  : null;
