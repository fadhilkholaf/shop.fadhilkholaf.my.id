import Image from "next/image";
import Link from "next/link";

import { getAllProduct } from "@/query/product";

export default async function ProductsPage() {
    const products = await getAllProduct();

    return (
        <>
            <h1>Products Page</h1>
            <ul>
                {products.map(function (product, i) {
                    return (
                        <li key={i}>
                            <Link href={`/products/${product.publicId}`}>
                                <h1>{product.name}</h1>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={500}
                                    height={500}
                                    priority
                                    className="h-fit max-h-[500px] w-fit max-w-[500px] object-cover"
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
