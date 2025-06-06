export default function PrivacyPolicyPage() {
    return (
        <main className="layout my-16">
            <h1>Privacy Policy</h1>
            <ul className="list-disc pl-4">
                <li>
                    We only collect minimal data from your GitHub accout, such
                    as:
                    <ul className="list-disc pl-4">
                        <li>User id</li>
                        <li>Username</li>
                        <li>Profile image</li>
                    </ul>
                </li>
                <li>
                    And data from PayPal payment API like:
                    <ul className="list-disc pl-4">
                        <li>Order id</li>
                        <li>Capture id</li>
                    </ul>
                </li>
            </ul>
            <p>{`That's it, nothing else`}</p>
        </main>
    );
}
