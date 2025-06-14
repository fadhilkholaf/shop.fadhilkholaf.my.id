import PMO from "./PMO";
import ProductButton from "./ProductButton";

export default function ProductsAdminPageHero() {
    return (
        <section className="flex flex-col gap-y-8 md:gap-y-16">
            <header className="flex flex-col items-center">
                <h1 className="text-center text-4xl md:text-6xl xl:text-8xl">
                    More Products 📑
                </h1>
                <p>The repositories</p>
            </header>
            <main>
                <PMO />
            </main>
            <footer className="h-screen">
                <ProductButton>Create Product</ProductButton>
            </footer>
        </section>
    );
}
