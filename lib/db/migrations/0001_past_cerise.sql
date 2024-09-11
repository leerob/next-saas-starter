ALTER TABLE "users" ADD COLUMN "stripe_product_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_product_id_unique" UNIQUE("stripe_product_id");