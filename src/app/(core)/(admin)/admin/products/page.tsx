import { getAllProduct } from "@/query/product";
import ProductModal from "./_components/ProductModal";

export default async function ProductsPage() {
    const products = await getAllProduct();

    return (
        <>
            <ProductModal />
            <ul>
                {products.map(function (product, i) {
                    return <li key={i}>{product.name}</li>;
                })}
            </ul>
        </>
    );
}
