"use server";

import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/lib/auth";
import { ResponseTemplate } from "@/types/response";
import { responseError } from "@/utils/response";

export async function signInAction(
    formData: FormData,
    pathname: string,
): Promise<ResponseTemplate<null, string> | undefined> {
    const privacyPolicy = formData.get("privacy-policy");
    const termsAndConditions = formData.get("terms-and-conditions");

    if (!privacyPolicy || !termsAndConditions) {
        return responseError(
            "Please read and accept with privacy policy and terms and conditions!",
        );
    }

    await signIn("github", { redirectTo: pathname });

    revalidatePath("/", "layout");
}

export async function signOutAction(pathname: string) {
    await signOut({ redirectTo: pathname });

    revalidatePath("/", "layout");
}
