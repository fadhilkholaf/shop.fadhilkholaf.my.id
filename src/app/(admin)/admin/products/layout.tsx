import { type ReactNode } from "react";

import ProductModalProvider from "@/context/ProductModalContext";

export default function AdminProductsLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <ProductModalProvider>{children}</ProductModalProvider>
        </>
    );
}
