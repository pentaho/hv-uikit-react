import { createContext } from "react";
import createCache, { type EmotionCache } from "@emotion/cache";

export const defaultCacheKey = "hv";

export const defaultEmotionCache = createCache({
  key: defaultCacheKey,
  prepend: true,
});

export const EmotionContext = createContext<{ cache: EmotionCache }>({
  cache: defaultEmotionCache,
});
