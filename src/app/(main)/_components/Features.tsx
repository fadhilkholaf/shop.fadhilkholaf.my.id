export default function Features() {
    return (
        <section className="flex flex-col gap-y-16">
            <header className="flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl xl:text-9xl">
                    Features 🏄🏿‍♀️
                </h1>
                <p>This things is easy!</p>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <li>
                        <article>
                            <header>
                                <h4>Very Customizable</h4>
                            </header>
                            <main>
                                <p>As long as you can read the code 🫶.</p>
                            </main>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h4>Optimized SEO</h4>
                            </header>
                            <p>It can appear on your #1 search.</p>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h4>Easy Deployment</h4>
                            </header>
                            <main>
                                <p>
                                    You can deploy it on Vercel, Cloudflare,
                                    Netlify, VPS, or you can ask me for
                                    deployment 🫶.
                                </p>
                            </main>
                        </article>
                    </li>
                </ul>
            </main>
        </section>
    );
}
