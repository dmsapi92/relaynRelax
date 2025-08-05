import type { RazorpayConfig } from "./razorpay.server";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions extends RazorpayConfig {
  order_id: string;
  amount: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export function initializeRazorpayPayment(options: PaymentOptions) {
  const razorpay = new window.Razorpay({
    ...options,
    handler: function (response: RazorpayResponse) {
      options.handler(response);
    },
  });

  razorpay.open();
  return razorpay;
}
