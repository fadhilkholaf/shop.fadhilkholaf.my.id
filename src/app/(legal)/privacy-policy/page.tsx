import MarkdownRenderer from "@/components/MarkdownRenderer";

const privacyPolicy = `
*Last update: June 22, 2025.*

# Privacy Policy

How we collect users data.

### Collected Data

We collected users data from GitHub such as: 

- User id.
- User name.
- User profile photo.

### Purpose of the Data

Data collected is used for working with GitHub API and managing users session.

### Data Sharing

We don't share collected user data outside our application.

### How Long the Data is Collected

The data is don't have expiration time unless the user requested a deletion.

### Data Deletion

Users can request data deletion personally through this email [fadhilkholafbusiness@gmail.com](mailto:fadhilkholafbusiness@gmail.com)
`;

export default function PrivacyPolicyPage() {
    return (
        <main className="layout my-16">
            <MarkdownRenderer>{privacyPolicy}</MarkdownRenderer>
        </main>
    );
}
