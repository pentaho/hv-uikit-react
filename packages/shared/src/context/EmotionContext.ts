/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
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
