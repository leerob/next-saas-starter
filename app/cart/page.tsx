import { redirect } from "next/navigation";
import { getCartForUser, getCartItems, getUser } from "@/lib/db/queries";
import { CartItems } from "@/components/cart/cart-items";
import { CartSummary } from "@/components/cart/cart-summary";

export default async function CartPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const cart = await getCartForUser(user.id);

  if (!cart) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">カート</h1>
        <p>カートは空です</p>
      </div>
    );
  }

  const cartItems = await getCartItems(cart.id);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">カート</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CartItems items={cartItems} />
        </div>
        <div>
          <CartSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}
