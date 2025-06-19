"use client";

import Form from "next/form";
import Image from "next/image";

import { removeCartItemAction } from "@/actions/cart";
import { useCartModal } from "@/components/context/CartModalContext";
import { Product } from "@/prisma/generated";
import { formatUsd } from "@/utils/format";
import Link from "next/link";

export default function CartItem({ product }: { product: Product }) {
    const { setIsOpen } = useCartModal();

    return (
        <article className="flex flex-col gap-y-2">
            <Link
                href={`/products/${product.publicId}`}
                onClick={function () {
                    setIsOpen(false);
                }}
            >
                <main className="flex gap-x-4">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={1920}
                        height={1080}
                        priority
                        className="border-secondary aspect-video h-fit w-32 rounded-lg border-2 object-cover md:w-60"
                    />
                    <header>
                        <h3>{product.name}</h3>
                        <p>{formatUsd(product.price)}</p>
                    </header>
                </main>
            </Link>
            <footer>
                <RemoveFromCartButton product={product} />
            </footer>
        </article>
    );
}

function RemoveFromCartButton({ product }: { product: Product }) {
    const { cartData: cart, setCartData } = useCartModal();

    if (!cart) {
        return <p>Invalid cart data!</p>;
    }

    return (
        <Form
            action={async function () {
                const response = await removeCartItemAction(
                    cart.id,
                    product.id,
                );

                if (response.error) {
                    alert(response.error);
                    return;
                }

                setCartData(response.result);
            }}
            className="flex justify-end"
        >
            <button type="submit">Remove 🚮</button>
        </Form>
    );
}
