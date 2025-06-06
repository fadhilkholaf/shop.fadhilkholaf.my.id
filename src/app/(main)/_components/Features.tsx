export default function Features() {
    return (
        <section className="flex flex-col gap-y-16">
            <header>
                <h1>Feature and Benefits</h1>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <li>
                        <article>
                            <header>
                                <h5>Very Customizable</h5>
                            </header>
                            <main>
                                <p>As long as you can read the code 🫶.</p>
                            </main>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h5>Optimized SEO</h5>
                            </header>
                            <p>It can appear on your #1 search.</p>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h5>Easy Deployment</h5>
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
