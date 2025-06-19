const testimonials: { title: string; desc: string }[] = [
    {
        title: "Fadhil, The Creator",
        desc: "This is suck bro. 🥀🙏🏿❌😭",
    },
    {
        title: "Tester",
        desc: "God will help you gang keep it going. 🌺🌷💮💐",
    },
    {
        title: "That Guy",
        desc: "Nice thing.",
    },
];

export default function Testimonials() {
    return (
        <section className="page-section">
            <header className="flex flex-col items-center">
                <h1 className="text-center text-4xl md:text-6xl xl:text-8xl">
                    They Say 🥷🏿
                </h1>
                <p>{`It's actually good`}</p>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map(function (testimoni, i) {
                        return (
                            <li key={i}>
                                <article>
                                    <header>
                                        <h1>{testimoni.title}</h1>
                                    </header>
                                    <main>
                                        <p>{testimoni.desc}</p>
                                    </main>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </main>
            <footer></footer>
        </section>
    );
}
