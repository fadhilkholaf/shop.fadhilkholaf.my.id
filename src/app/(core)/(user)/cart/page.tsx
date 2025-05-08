import { auth } from "@/lib/auth";
import { Prisma } from "@/prisma/generated";
import { notFound } from "next/navigation";
import Form from "next/form";
import { getAllCart } from "@/query/cart";
import { createOrderAction } from "@/actions/order";

export default async function UserPage() {
    const session = await auth();

    if (!session) {
        notFound();
    }

    const carts = (await getAllCart(
        {
            AND: [
                { user: { githubId: session.user.githubId } },
                { order: null },
            ],
        },
        { products: true },
    )) as Prisma.CartGetPayload<{ include: { products: true } }>[];

    return (
        <>
            <h1>User Page</h1>

            <ul>
                {carts.map(function (cart, i) {
                    return (
                        <ul key={i}>
                            <ul>
                                {cart.products.map(function (product, j) {
                                    return <li key={j}>{product.name}</li>;
                                })}
                            </ul>
                            <Form
                                action={async function () {
                                    "use server";

                                    const response =
                                        await createOrderAction(cart);

                                    console.log(response);
                                }}
                            >
                                <button type="submit">Create Order</button>
                            </Form>
                        </ul>
                    );
                })}
            </ul>
        </>
    );
}
