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
            // { status: "unpaid" },
            // { createdAt: { gte: new Date(Date.now() - 60 * 1000) } },
        ],
    });

    return (
        <>
            <h1>Yout order</h1>
            <p>complete payment</p>
            <ul>
                {orders
                    .filter(function (order) {
                        return (
                            order.createdAt >= new Date(Date.now() - 60 * 1000)
                        );
                    })
                    .map(function (order, i) {
                        return (
                            <li key={i}>
                                <h1>
                                    valid before{" "}
                                    {new Date(
                                        new Date(
                                            order.createdAt.getTime() +
                                                60 * 1000,
                                        ),
                                    ).toISOString()}
                                </h1>
                                <h1>{order.id}</h1>
                                {/* <CheckOutButton id={order.orderId} /> */}
                            </li>
                        );
                    })}
            </ul>
            <hr />
            <h1>Expired order</h1>
            <ul>
                {orders
                    .filter(function (order) {
                        return (
                            order.createdAt <= new Date(Date.now() - 60 * 1000)
                        );
                    })
                    .map(function (order, i) {
                        return (
                            <li key={i}>
                                <h1>
                                    valid before{" "}
                                    {new Date(
                                        new Date(
                                            order.createdAt.getTime() +
                                                60 * 1000,
                                        ),
                                    ).toISOString()}
                                </h1>
                                <h1>{order.id}</h1>
                                {/* <CheckOutButton id={order.orderId} /> */}
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}
