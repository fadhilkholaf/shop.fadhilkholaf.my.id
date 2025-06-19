import Image from "next/image";
import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";

export default function MarkdownRenderer({ children }: { children?: string }) {
    return (
        <article className="flex flex-col gap-y-4">
            <Markdown
                rehypePlugins={[rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
                components={{
                    a: CustomA,
                    blockquote: CustomBlockquote,
                    code: CustomCode,
                    h1: CustomH1,
                    h2: CustomH2,
                    h3: CustomH3,
                    h4: CustomH4,
                    img: CustomImg,
                    ul: CustomUl,
                }}
            >
                {children}
            </Markdown>
        </article>
    );
}

function CustomA({ href, ...props }: ComponentPropsWithoutRef<"a">) {
    if (href && href.startsWith("/")) {
        return <Link href={href} {...props} />;
    }
    return <a href={href} target="_blank" {...props} />;
}

function CustomBlockquote({
    ...props
}: ComponentPropsWithoutRef<"blockquote">) {
    return (
        <blockquote
            className="rounded-lg border-l-2 px-2 py-1 backdrop-brightness-90"
            {...props}
        />
    );
}

function CustomCode({ children, ...props }: ComponentPropsWithoutRef<"code">) {
    return (
        <code
            dangerouslySetInnerHTML={{
                __html: highlight(children as string),
            }}
            {...props}
        />
    );
}

function CustomH1({ ...props }: ComponentPropsWithoutRef<"h1">) {
    return <h1 className="mt-4" {...props} />;
}

function CustomH2({ ...props }: ComponentPropsWithoutRef<"h2">) {
    return <h2 className="mt-4" {...props} />;
}

function CustomH3({ ...props }: ComponentPropsWithoutRef<"h3">) {
    return <h3 className="mt-4" {...props} />;
}

function CustomH4({ ...props }: ComponentPropsWithoutRef<"h4">) {
    return <h4 className="mt-4" {...props} />;
}

function CustomImg({
    src = "https://i.scdn.co/image/ab67616d0000b2732f7f3720b0f96f2e6e22b782",
    alt = "Preview image",
    width,
    height,
    ...props
}: ComponentPropsWithoutRef<"img">) {
    return (
        <span className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <span className="bg-secondary rounded-2xl p-2 md:rounded-3xl md:p-4">
                <Image
                    src={src as string}
                    alt={alt}
                    width={Number(width) || 1024}
                    height={Number(height) || 1024}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                    {...props}
                />
            </span>
        </span>
    );
}

function CustomUl({ ...props }: ComponentPropsWithoutRef<"ul">) {
    return <ul className="ml-4.5 list-disc" {...props} />;
}
