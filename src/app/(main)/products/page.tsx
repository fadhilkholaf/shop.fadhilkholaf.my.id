import Image from "next/image";
import Link from "next/link";

// import { auth } from "@/lib/auth";
import { getAllProduct } from "@/query/product";

export default async function ProductsPage() {
    // const session = await auth();

    const products = await getAllProduct();
    // session
    //     ? {
    //           carts: {
    //               none: {
    //                   user: { githubId: session.user.githubId },
    //                   order: { isNot: null },
    //               },
    //           },
    //       }
    //     : undefined,

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
                                    width={1024}
                                    height={1024}
                                    priority
                                    className="h-fit max-h-[1024px] w-fit max-w-[1024px] object-cover"
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
