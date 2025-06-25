import MarkdownRenderer from "@/components/MarkdownRenderer";

const termsAndConditions = `
*Last update: June 25, 2025.*

# Terms and Conditions

Rules of using this website.

### Acceptance

By using this site, you agree to these terms. If you don't agree, don't use our site.

### Who Can Use It

You must at least 18 years old.

### Responsibilities

Don't break in or disrupt our site.

### Intellectual Property

All content are owned by us.

### Termination

We may ban you or remove your access if you break these rules.

### Changes To Terms

We can update these anytime. We'll post the date above, and by continuing to use the site you accept new Terms.

### Contact

If you have question, email us at [fadhilkholafbusiness@gmail.com](mailto:fadhilkholafbusiness@gmail.com)
`;

export default function TermsAndConditionsPage() {
    return (
        <main className="layout my-16">
            <MarkdownRenderer>{termsAndConditions}</MarkdownRenderer>
        </main>
    );
}
