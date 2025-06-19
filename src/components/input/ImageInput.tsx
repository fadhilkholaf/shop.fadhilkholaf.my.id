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
            <header className="bg-secondary flex flex-col gap-y-2 rounded-2xl p-2 md:rounded-3xl md:p-4">
                <Image
                    src={preview}
                    alt="Product image"
                    width={1920}
                    height={1080}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                />
            </header>
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
