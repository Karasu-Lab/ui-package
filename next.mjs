import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

const sourcePackages = [
  '@karasu-lab/ui',
  '@karasu-lab/utils',
  '@karasu-lab/types',
  '@karasu-lab/flags',
  '@karasu-lab/db',
  '@karasu-lab/api-permissions',
  '@karasu-lab/challengetoken',
  '@karasu-lab/sdk',
];

/**
 * Next.js config wrapper for apps consuming the source-published
 * `@karasu-lab/*` packages.
 *
 * Inside the monorepo the packages resolve through workspace symlinks, so
 * their files sit outside `node_modules` and the app's tsconfig `paths`
 * apply to them. Installed from the registry they sit inside
 * `node_modules`, where the app's `paths` no longer apply and Next does
 * not transpile packages that are not listed. This wrapper restores both
 * halves of that behaviour for the installed layout:
 *
 * - `@/...` imports issued from within `@karasu-lab/ui` are rewritten to
 *   the package's own `src/...`, so the alias keeps resolving to the
 *   package's own modules (the app's own `@/...` imports are untouched).
 * - The installed `@karasu-lab/*` source packages are added to
 *   `transpilePackages`.
 */
export function withUi(nextConfig = {}) {
  const installed = sourcePackages.filter((name) =>
    existsSync(path.join(process.cwd(), 'node_modules', name, 'package.json')),
  );
  const transpilePackages = [...new Set([...(nextConfig.transpilePackages ?? []), ...installed])];
  const userWebpack = nextConfig.webpack;
  return {
    ...nextConfig,
    transpilePackages,
    webpack(config, options) {
      config.plugins.push(
        new options.webpack.NormalModuleReplacementPlugin(/^@\//, (resource) => {
          const context = (resource.context || '').replaceAll('\\', '/');
          if (context.includes('/@karasu-lab/ui/')) {
            resource.request = path.join(packageRoot, 'src', resource.request.slice(2));
          }
        }),
      );
      return userWebpack ? userWebpack(config, options) : config;
    },
  };
}
