import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { getAllOrder } from "@/query/order";
import CheckOutButton from "./_components/CheckOutButton";

export default async function OrderPage() {
    const session = await auth();

    if (!session) {
        notFound();
    }

    const orders = await getAllOrder({
        AND: [
            { cart: { user: { githubId: session.user.githubId } } },
            { status: "unpaid" },
        ],
    });

    return (
        <>
            <h1>Order Page</h1>
            <ul>
                {orders.map(function (order, i) {
                    return (
                        <li key={i}>
                            <h1>{order.id}</h1>
                            <CheckOutButton id={order.orderId} />
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
