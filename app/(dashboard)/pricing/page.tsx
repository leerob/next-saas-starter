import { Button } from '@/components/ui/button';
import { checkoutAction } from '@/lib/payments/actions';
import { ArrowRight, Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <div className="pt-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Base</h2>
          <p className="text-sm text-gray-600 mb-4">with 7 day free trial</p>
          <p className="text-4xl font-medium text-gray-900 mb-6">
            $8{' '}
            <span className="text-xl font-normal text-gray-600">
              per user / month
            </span>
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Unlimited Emails</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Unlimited Attachment Storage
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Unlimited Workspace Members</span>
            </li>
          </ul>
          <form action={checkoutAction}>
            <Button className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="pt-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Plus</h2>
          <p className="text-sm text-gray-600 mb-4">with 7 day free trial</p>
          <p className="text-4xl font-medium text-gray-900 mb-6">
            $12{' '}
            <span className="text-xl font-normal text-gray-600">
              per user / month
            </span>
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Everything in Base, and:</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Early Access to New Features
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Recognition in Our Credits</span>
            </li>
          </ul>
          <Button className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex items-center justify-center">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
