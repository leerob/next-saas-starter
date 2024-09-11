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
- Stripe integration for payments
- `useUser` hook for managing user data

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v18 or higher)
- **Postgres** (for database)
- **Stripe CLI** (for handling webhooks)

### Environment Variables

You'll need to set up the following environment variables for the application to run properly:

```bash
POSTGRES_URL="postgres://"
# For Stripe Test mode
STRIPE_WEBHOOK_SECRET="whsec_32f..."
STRIPE_SECRET_KEY="sk_test_..."
BASE_URL="http://localhost:3000"
```

You can set these in a `.env.local` file in the root directory of the project.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/leerob/next-saas-starter
cd next-saas-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

Ensure your PostgreSQL instance is running and accessible. Run the following to apply migrations:

```bash
npx drizzle-kit sync
```

4. Set up Stripe CLI:

To test Stripe webhooks locally, you'll need to install and log in to the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Running Locally

Once you have set up the environment variables and installed dependencies, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

### Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number
