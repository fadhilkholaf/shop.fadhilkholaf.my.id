export default function Testimonials() {
    return (
        <section className="flex flex-col gap-y-16">
            <header>
                <h1>What Are They Say</h1>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <li>
                        <article>
                            <header>
                                <h5>Fadhil, The Creator</h5>
                            </header>
                            <main>
                                <p>This is suck bro 🥀🙏🏿❌😭</p>
                            </main>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h5>Tester</h5>
                            </header>
                            <main>
                                <p>
                                    God will help you gang keep it going
                                    🌺🌷💮💐
                                </p>
                            </main>
                        </article>
                    </li>
                    <li>
                        <article>
                            <header>
                                <h5>That Guy</h5>
                            </header>
                            <main>
                                <p>Nice thing</p>
                            </main>
                        </article>
                    </li>
                </ul>
            </main>
            <footer></footer>
        </section>
    );
}
