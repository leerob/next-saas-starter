'use client';

import { useState } from 'react';
import { PricingCard } from './pricing-card';
import { CheckoutModal } from './checkout-modal';
import { checkoutAction } from '@/lib/payments/actions';

interface PricingCardWrapperProps {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}

export function PricingCardWrapper(props: PricingCardWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleCheckout = async (formData: FormData) => {
    const secret = await checkoutAction(formData);
    if (typeof secret === 'string') {
      setClientSecret(secret);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <PricingCard {...props} onSubmit={handleCheckout} />
      <CheckoutModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        clientSecret={clientSecret || ''}
      />
    </>
  );
}