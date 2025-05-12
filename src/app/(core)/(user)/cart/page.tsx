import Form from "next/form";
import Image from "next/image";
import { notFound } from "next/navigation";

import { createOrderAction } from "@/actions/order";
import { auth } from "@/lib/auth";
import { Prisma } from "@/prisma/generated";
import { getAllCart } from "@/query/cart";
import CheckOutButton from "../order/_components/CheckOutButton";

export default async function UserPage() {
    const session = await auth();

    if (!session) {
        notFound();
    }

    const carts = (await getAllCart(
        { user: { githubId: session.user.githubId }, order: null },
        { products: true },
    )) as Prisma.CartGetPayload<{ include: { products: true } }>[];

    return (
        <>
            <h1>Cart Page</h1>
            <ul>
                {carts.map(function (cart, i) {
                    return (
                        <ul key={i}>
                            <ul>
                                {cart.products.map(function (product, j) {
                                    return (
                                        <li key={j}>
                                            <h1>{product.name}</h1>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={500}
                                                height={500}
                                                priority
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="size-fit w-64">
                                <CheckOutButton cart={cart} />
                            </div>
                            {/* <Form
                                action={async function () {
                                    "use server";

                                    const response =
                                        await createOrderAction(cart);

                                    console.log(response);
                                }}
                            >
                                <button type="submit">Create Order</button>
                            </Form> */}
                        </ul>
                    );
                })}
            </ul>
        </>
    );
}
