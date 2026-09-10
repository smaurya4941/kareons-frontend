'use client';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; email?: string; contact?: string };
}

/** Opens Razorpay Checkout.js — the script tag is loaded via next/script in CheckoutForm before this runs. */
export function openRazorpayCheckout(options: RazorpayOptions) {
  if (typeof window === 'undefined' || !window.Razorpay) {
    throw new Error('Razorpay script has not loaded yet.');
  }
  new window.Razorpay(options).open();
}
