import { type ComponentPropsWithoutRef } from "react";

export default function MarkdownInput({
    label,
    errors,
    ...props
}: {
    label: string;
    errors?: string[];
} & ComponentPropsWithoutRef<"textarea">) {
    return (
        <article className="flex flex-col">
            <label htmlFor={props.id}>{label}</label>
            <textarea
                className="border-secondary rounded-lg border px-2 py-1"
                {...props}
            />
            <ul className="flex list-disc flex-col pl-4.5">
                {errors?.map(function (error, i) {
                    return (
                        <li key={i} className="text-error">
                            <p>{error}</p>
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}
