const features: { title: string; desc: string }[] = [
    {
        title: "Very Customizable",
        desc: "As long as you can read the code. 🫶",
    },
    {
        title: "Optimized SEO",
        desc: "It can appear on your #1 search.",
    },
    {
        title: "Easy Deployment",
        desc: "You can deploy it on Vercel, Cloudflare, Netlify, VPS, or you can ask me for deployment 🫶.",
    },
];

export default function Features() {
    return (
        <section className="flex flex-col gap-y-8 md:gap-y-16">
            <header className="flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl xl:text-8xl">
                    Features 🏄🏿‍♀️
                </h1>
                <p>This things is easy!</p>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map(function (feature, i) {
                        return (
                            <li key={i}>
                                <article>
                                    <header>
                                        <h1>{feature.title}</h1>
                                    </header>
                                    <main>
                                        <p>{feature.desc}</p>
                                    </main>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </main>
        </section>
    );
}
