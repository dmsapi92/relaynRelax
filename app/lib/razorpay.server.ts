import crypto from "crypto";
import Razorpay from "razorpay";
import { ENV } from "~/env.server";

if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials are not configured");
}

export const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export async function createSubscriptionOrder(
  amount: number,
  currency: string
): Promise<RazorpayOrder> {
  try {
    const order = (await razorpay.orders.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: true, // Fixed boolean type
      notes: {
        description: "Subscription Order",
      },
    })) as RazorpayOrder; // Type assertion to fix return type
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
}

export interface RazorpayConfig {
  key: string;
  currency: string;
  name: string;
  description: string;
  theme: {
    color: string;
  };
}

export function getRazorpayConfig(): RazorpayConfig {
  return {
    key: ENV.RAZORPAY_KEY_ID!,
    currency: "INR",
    name: "Institute Management System",
    description: "Subscription Payment",
    theme: {
      color: "#6366f1",
    },
  };
}
