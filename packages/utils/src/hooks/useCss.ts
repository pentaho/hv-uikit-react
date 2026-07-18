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
import { useMemo } from "react";
import { serializeStyles, type RegisteredCache } from "@emotion/serialize";
import { getRegisteredStyles, insertStyles } from "@emotion/utils";
import { clsx } from "clsx";
import { useEmotionCache } from "@hitachivantara/uikit-react-shared";

type CSS = any;

function getRef(args: any[]) {
  if (args.length !== 1) {
    return { args, ref: undefined };
  }

  const [arg] = args;

  if (!(arg instanceof Object)) {
    return { args, ref: undefined };
  }

  if (!("ref" in arg)) {
    return { args, ref: undefined };
  }

  const { ref, ...argCopy } = arg;
  return { args: [argCopy], ref };
}

const cssFactory = (() => {
  function merge(registered: RegisteredCache, css: CSS, className: string) {
    const registeredStyles: string[] = [];

    const rawClassName = getRegisteredStyles(
      registered,
      registeredStyles,
      className,
    );

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css(registeredStyles);
  }

  function innerCssFactory(cache: ReturnType<typeof useEmotionCache>) {
    const css: CSS = (...styles: any) => {
      const { ref, args } = getRef(styles);
      const serialized = serializeStyles(args, cache.registered);
      insertStyles(cache, serialized, false);
      return `${cache.key}-${serialized.name}${
        ref === undefined ? "" : ` ${ref}`
      }`;
    };

    const cx = (...args: any) => merge(cache.registered, css, clsx(args));

    return { css, cx } as const;
  }

  return innerCssFactory;
})();

export function useCss() {
  const cache = useEmotionCache();
  return useMemo(() => cssFactory(cache), [cache]);
}
