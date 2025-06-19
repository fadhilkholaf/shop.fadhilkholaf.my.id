import Form from "next/form";
import { Dispatch, SetStateAction } from "react";

import {
    AllCommunityModule,
    ColDef,
    iconSetAlpine,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import { deleteProductAction } from "@/actions/product";
import { useProductModal } from "@/components/context/ProductModalContext";
import { getProduct } from "@/database/product";
import { Product } from "@/prisma/generated";
import { formatDate, formatUsd } from "@/utils/format";

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

export default function ProductTable({ products }: { products: Product[] }) {
    const { setIsOpen, setProduct } = useProductModal();

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
                if (p.value === 0) {
                    return "Free";
                }

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
            cellRenderer: function ActionButton(
                p: CustomCellRendererProps<Product>,
            ) {
                return (
                    <ul className="flex justify-center gap-x-4">
                        <li>
                            <UpdateProductButton
                                p={p}
                                setIsOpen={setIsOpen}
                                setProduct={setProduct}
                            />
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
        <article data-lenis-prevent className="h-[500px] w-full">
            <AgGridReact
                theme={theme}
                columnDefs={colDefs}
                rowData={products}
                defaultColDef={{ flex: 1, filter: true, minWidth: 200 }}
            />
        </article>
    );
}

function UpdateProductButton({
    p,
    setIsOpen,
    setProduct,
}: {
    p: CustomCellRendererProps<Product>;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setProduct: Dispatch<SetStateAction<Product | null>>;
}) {
    return (
        <Form
            action={async function () {
                const product = await getProduct({
                    publicId: p.value,
                });

                setIsOpen(true);
                setProduct(product);
            }}
        >
            <button type="submit" className="bg-secondary w-10 rounded-lg">
                ✍️
            </button>
        </Form>
    );
}
