import { apiFetch } from "./api-fetch";

export interface UploadImageOptions {
    apiUrl: string;
    path?: string;
}

export async function uploadImage(
    file: File,
    options: UploadImageOptions,
): Promise<string | null> {
    const form = new FormData();
    form.append("file", file);
    if (options.path) form.append("path", options.path);
    try {
        const res = await apiFetch(`${options.apiUrl}/upload`, {
            method: "POST",
            body: form,
            credentials: "include",
        });
        if (!res.ok) return null;
        const { url } = (await res.json()) as { url: string };
        return url;
    } catch {
        return null;
    }
}
