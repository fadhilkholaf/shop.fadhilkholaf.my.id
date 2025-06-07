import { getSoldProduct } from "@/query/product";
import AdminPageHero from "./_components/AdminPageHero";

export default async function AdminPage() {
    // const sold = await getSoldProduct();

    // console.log({ sold });

    return (
        <main className="layout mt-32 flex flex-col gap-y-32">
            <AdminPageHero />
        </main>
    );
}
