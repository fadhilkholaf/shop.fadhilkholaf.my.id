import Image from "next/image";
import { type ComponentPropsWithoutRef } from "react";

export default function ImageInput({
    label,
    preview,
    errors,
    ...props
}: { label: string; preview: string; errors?: string[] } & Omit<
    ComponentPropsWithoutRef<"input">,
    "type" | "accept"
>) {
    return (
        <article className="flex flex-col">
            <Image
                src={preview}
                alt="Product image"
                width={1024}
                height={1024}
                priority
                className="aspect-video w-full rounded-lg object-cover"
            />
            <label htmlFor={props.id}>{label}</label>
            <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/gif"
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
