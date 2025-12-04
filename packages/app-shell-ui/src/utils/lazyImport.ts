import {
  AsyncResult,
  type PreloadedBundles,
} from "@hitachivantara/app-shell-shared";

export type LazyImportResult = AsyncResult<unknown, Error, "module">;

export async function lazyImport(bundle: string): Promise<LazyImportResult> {
  try {
    const module = await import(/* @vite-ignore */ bundle);

    return {
      isPending: false,
      error: null,
      module: module.default,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    return {
      isPending: false,
      error,
      module: undefined,
    };
  }
}

export async function importAllBundles(
  bundles: string[],
): Promise<PreloadedBundles> {
  const results = await Promise.all(
    bundles.map((bundle) => lazyImport(bundle)),
  );

  const preloadedBundles: PreloadedBundles = new Map();

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const bundle = bundles[i];

    if (result.error) {
      console.error(`Failed to load bundle ${bundle}:`, result.error);
      continue;
    }

    preloadedBundles.set(bundle, result.module);
  }

  return preloadedBundles;
}
