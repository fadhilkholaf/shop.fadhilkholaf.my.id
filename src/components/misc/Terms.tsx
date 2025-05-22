import Link from "next/link";

export default function Terms({ closeModal }: { closeModal: () => void }) {
    return (
        <>
            <div className="flex items-center gap-x-4">
                <input
                    type="checkbox"
                    name="privacy-policy"
                    id="privacy-policy"
                />
                <label htmlFor="privacy-policy">
                    {`I have read and agree with `}
                    <Link
                        href="/privacy-policy"
                        className="font-semibold"
                        onClick={closeModal}
                    >
                        privacy policy.
                    </Link>
                </label>
            </div>
            <div className="flex items-center gap-x-4">
                <input
                    type="checkbox"
                    name="terms-and-conditions"
                    id="terms-and-conditions"
                />
                <label htmlFor="terms-and-conditions">
                    {`I have read and agree with `}
                    <Link
                        href="/terms-and-conditions"
                        className="font-semibold"
                        onClick={closeModal}
                    >
                        terms and conditions.
                    </Link>
                </label>
            </div>
        </>
    );
}
