"use client";

import {
    AllCommunityModule,
    ColDef,
    iconSetAlpine,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import ProductButton from "@/components/buttons/ProductModalButton";
import { Product } from "@/prisma/generated";
import { formatDate, formatUsd } from "@/utils/format";
import Form from "next/form";
import { getProduct } from "@/database/product";
import { useProductModal } from "@/components/context/ProductModalContext";
import { deleteProductAction } from "@/actions/product";

ModuleRegistry.registerModules([AllCommunityModule]);

const theme = themeQuartz.withPart(iconSetAlpine).withParams({
    accentColor: "#1E2939",
    backgroundColor: "#FCCEE8",
    borderColor: "#1E2939",
    borderRadius: 4,
    columnBorder: false,
    fontFamily: "inherit",
    fontSize: 16,
    foregroundColor: "#1E2939",
    headerBackgroundColor: "#1E2939",
    headerFontSize: 16,
    headerFontWeight: 700,
    headerRowBorder: false,
    headerTextColor: "#FCCEE8",
    rowBorder: false,
    wrapperBorder: true,
    wrapperBorderRadius: 8,
});

export default function ProductsAdminPageHero({
    products,
}: {
    products: Product[];
}) {
    const colDefs: ColDef<Product>[] = [
        {
            headerName: "Name",
            field: "name",
        },
        {
            headerName: "Price",
            field: "price",
            cellClass: "font-mono",
            valueFormatter: function (p) {
                return formatUsd(p.value);
            },
        },
        {
            headerName: "Created At",
            field: "createdAt",
            sort: "desc",
            valueFormatter: function (p) {
                return formatDate(p.value);
            },
        },
        {
            headerName: "",
            field: "publicId",
            filter: false,
            sortable: false,
            resizable: false,
            cellRenderer: function ActionButton(p: CustomCellRendererProps) {
                const { setIsOpen, setProduct } = useProductModal();

                return (
                    <ul className="flex justify-center gap-x-4">
                        <li>
                            <Form
                                action={async function () {
                                    const product = await getProduct({
                                        publicId: p.value,
                                    });

                                    setIsOpen(true);
                                    setProduct(product);
                                }}
                            >
                                <button
                                    type="submit"
                                    className="bg-secondary w-10 rounded-lg"
                                >
                                    ✍️
                                </button>
                            </Form>
                        </li>
                        <li>
                            <Form
                                action={async function () {
                                    const response = await deleteProductAction(
                                        p.value,
                                    );

                                    if (!response.result) {
                                        alert(response.error);
                                    }
                                }}
                            >
                                <button
                                    type="submit"
                                    className="bg-secondary w-10 rounded-lg"
                                >
                                    🗑️
                                </button>
                            </Form>
                        </li>
                    </ul>
                );
            },
        },
    ];

    return (
        <section className="page-section">
            <header className="flex flex-col items-center">
                <h1 className="text-center text-4xl md:text-6xl xl:text-8xl">
                    The Products 📑
                </h1>
                <p>Manage or create new products</p>
            </header>
            <main className="flex flex-col items-end gap-y-4">
                <ProductButton className="bg-secondary text-primary w-fit rounded-lg px-4 py-2">
                    Create Product
                </ProductButton>
                <article data-lenis-prevent className="h-[500px] w-full">
                    <AgGridReact
                        theme={theme}
                        columnDefs={colDefs}
                        rowData={products}
                        defaultColDef={{ flex: 1, filter: true, minWidth: 200 }}
                    />
                </article>
            </main>
        </section>
    );
}
