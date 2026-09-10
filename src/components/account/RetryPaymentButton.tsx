'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { resumeOrderPaymentAction } from '@/lib/actions/orders';
import { verifyPaymentAction } from '@/lib/actions/checkout';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';

export function RetryPaymentButton({
  orderId,
  orderNumber,
  siteName,
}: {
  orderId: number;
  orderNumber: string;
  siteName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [scriptReady, setScriptReady] = useState(false);

  function retry() {
    startTransition(async () => {
      const result = await resumeOrderPaymentAction(orderId);
      if (!result.success || !result.razorpay) {
        toast(result.message ?? 'Could not reopen the payment.', 'error');
        router.refresh();
        return;
      }

      if (!scriptReady && typeof window !== 'undefined' && !window.Razorpay) {
        toast('Payment is still loading — please try again in a moment.', 'info');
        return;
      }

      openRazorpayCheckout({
        key: result.razorpay.key,
        amount: result.razorpay.amount,
        currency: result.razorpay.currency,
        name: siteName,
        order_id: result.razorpay.order_id,
        handler: (response) => {
          startTransition(async () => {
            const verification = await verifyPaymentAction(response);
            if (verification.success) {
              toast('Payment received — your order is confirmed.', 'success', { title: 'Payment Successful' });
            } else {
              toast(verification.message ?? 'Payment verification failed.', 'error');
            }
            router.refresh();
          });
        },
        modal: {
          ondismiss: () => toast('Payment was not completed.', 'info'),
        },
      });
    });
  }

  return (
    <div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <p className="mb-3 text-sm text-on-surface-variant">
        Payment for order <span className="font-medium text-on-surface">#{orderNumber}</span> is still pending.
      </p>
      <button
        type="button"
        onClick={retry}
        disabled={isPending}
        className="btn-primary disabled:opacity-60"
      >
        <Icon name={isPending ? 'progress_activity' : 'lock'} size={18} className={isPending ? 'animate-spin' : undefined} />
        {isPending ? 'Opening…' : 'Complete Payment'}
      </button>
    </div>
  );
}
