"use server";

import { orders } from "@paypal/checkout-server-sdk";

import { paypalClient } from "@/lib/paypal";

export async function createPaypalOrder() {
    try {
        //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
        const request = new orders.OrdersCreateRequest();
        request.headers["Prefer"] = "return=representation";
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "1",
                    },
                },
            ],
        });
        const response = await paypalClient().execute(request);
        return response;

        // if (response.statusCode !== 201) {
        //   console.log("RES: ", response)
        //   return res.status(500).json({success: false, message: "Some Error Occured at backend"})
        // }

        // ...

        // Your Custom Code for doing something with order
        // Usually Store an order in the database like MongoDB

        // ...

        // res.status(200).json({success: true, data: {order}})
    } catch (err) {
        console.log("Err at Create Order: ", err);
        // return res
        //     .status(500)
        //     .json({ success: false, message: "Could Not Found the user" });
    }
}

export async function capturePaypalOrder(id: string) {
    //Capture order to complete payment
    // const { orderID } = req.body;
    const request = new orders.OrdersCaptureRequest(id);
    request.requestBody({
        payment_source: {
            token: { id, type: "BILLING_AGREEMENT" },
        },
    });
    const response = await paypalClient().execute(request);
    return response;
    // return response.result.id;

    //   if (!response) {
    //     return res.status(500).json({success: false, message: "Some Error Occured at backend"})
    //   }

    //   ...

    // Your Custom Code to Update Order Status
    // And Other stuff that is related to that order, like wallet
    // Here I am updateing the wallet and sending it back to frontend to update it on frontend

    //   ...

    //   res.status(200).json({success: true, data: {wallet}})
}
