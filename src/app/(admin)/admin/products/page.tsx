import { getAllProduct } from "@/query/product";
import ProductModal from "./_components/ProductModal";

export default async function ProductsPage() {
    const products = await getAllProduct();

    return (
        <main className="layout mt-32 flex flex-col gap-y-32">
            <ProductModal />
            <ul>
                {products.map(function (product, i) {
                    return <li key={i}>{product.name}</li>;
                })}
            </ul>
        </main>
    );
}
