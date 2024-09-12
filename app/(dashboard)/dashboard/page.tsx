'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/auth';
import { openCustomerPortal } from '@/lib/payments/actions';
import { useFormStatus } from 'react-dom';

export default function DashboardPage() {
  let { user } = useUser();

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">
        Dashboard Tutorial
      </h1>
      <ol className="list-decimal list-inside space-y-6 text-gray-700">
        <li className="pl-2">
          Welcome to the dashboard. This route is protected and only allowed to
          be accessed when logged in. Your username is{' '}
          <strong className="text-gray-900">{user?.username}</strong>.
        </li>
        <li className="pl-2">
          Learn more about how this route is protected by{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            exploring the code
          </Link>
          .
        </li>
        <li className="pl-2">
          <Link href="#" className="text-blue-600 hover:underline">
            Clone and deploy
          </Link>{' '}
          your own version to get started building your SaaS.
        </li>
      </ol>
      <form action={openCustomerPortal} className="mt-12">
        <SubmitButton />
      </form>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex items-center justify-center"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        <>
          Manage Subscription
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
