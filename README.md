# Next.js SaaS Starter

> [!IMPORTANT]  
> This repo is a work-in-progress and not ready for 👀

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

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
