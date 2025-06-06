import { ExternalToast, toast as t } from "sonner";

import { cn } from "@/utils/cn";

export function toast(
    message: string,
    type: "loading" | "success" | "error",
    data?: ExternalToast,
) {
    return t.custom(function () {
        return (
            <div
                className={cn(
                    "bg-secondary text-primary size-full rounded-lg p-4 md:min-w-[356px]",
                    { "": type === "loading" },
                    { "": type === "success" },
                    { "": type === "error" },
                )}
            >
                <p>{message}</p>
            </div>
        );
    }, data);
}
