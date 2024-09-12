# Next.js SaaS Starter

> [!IMPORTANT]  
> This repo is a work-in-progress and not ready for 👀

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

**Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Features

- **Logged-Out Experience:**
  - Home Page
  - Pricing Page
- **Logged-In Experience:**
  - Dashboard Page
- User authentication (cookie-based, email/password)
- Stripe integration for payments (Checkout & Customer Portal)
- `useUser` hook for managing user data

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/leerob/next-saas-starter
pnpm install
pnpm db:setup
pnpm db:seed
```

## Running Locally

Once you have set up the environment variables and installed dependencies, run the development server:

```bash
pnpm dev
```

Then, also listen for Stripe webhooks locally through their CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `DATABASE_URL`: Set this to your production database URL.
