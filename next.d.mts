/**
 * The declaration intentionally does not reference the `next` package's
 * types. Consuming apps run different Next.js majors (15 and 16), and the
 * `NextConfig` types of different majors are not structurally compatible
 * (for example, the `headers` return type changed in 16), so typing the
 * wrapper against one major's `NextConfig` breaks the other major's
 * builds. The wrapper is typed as the identity over the caller's own
 * config type instead.
 */
export declare function withUi<T extends object>(nextConfig?: T): T;
