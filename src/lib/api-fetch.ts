export function setSessionToken(token: string | null): void {
    if (token) sessionStorage.setItem("app-jwt", token);
    else sessionStorage.removeItem("app-jwt");
}

export interface ApiFetchOptions extends Omit<RequestInit, "headers"> {
    headers?: HeadersInit;
    token?: string | null;
}

export async function apiFetch(
    input: string | URL,
    {
        token = sessionStorage.getItem("app-jwt"),
        headers,
        ...rest
    }: ApiFetchOptions = {},
): Promise<Response> {
    return fetch(input, {
        ...rest,
        headers: token
            ? { ...headers, Authorization: `Bearer ${token}` }
            : headers,
    });
}
