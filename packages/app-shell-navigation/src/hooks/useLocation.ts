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
import {
  matchRoutes,
  useLocation as useLocationReactRouter,
  type Location,
} from "react-router-dom";
import {
  useHvAppShellModel,
  type HvAppShellViewsModel,
} from "@hitachivantara/app-shell-shared";

interface IndexedView {
  path: string;
  children?: IndexedView[];
  view: HvAppShellViewsModel;
}

function indexViews(views: HvAppShellViewsModel[]): IndexedView[] {
  return views.map((view) => {
    // remove prefix slash from view.route
    const path = view.route.slice(1);
    const isIndex =
      path === "" && (view.views == null || view.views.length === 0);

    if (isIndex) {
      return {
        path,
        view,
      };
    }

    return {
      path,
      view,
      children: view.views ? indexViews(view.views) : undefined,
    };
  });
}

class LocationWithViews<State = unknown> implements Location<State> {
  state: State;

  key: string;

  pathname: string;

  search: string;

  hash: string;

  #configViews: HvAppShellViewsModel[];

  private matches: HvAppShellViewsModel[] | null = null;

  constructor(
    location: Location<State>,
    views: HvAppShellViewsModel[] | undefined | null,
  ) {
    this.state = location.state;
    this.key = location.key;
    this.pathname = location.pathname;
    this.search = location.search;
    this.hash = location.hash;

    this.#configViews = views ?? [];
  }

  get views() {
    if (this.matches == null) {
      const indexedViews = indexViews(this.#configViews);
      this.matches =
        matchRoutes(indexedViews, this)?.map((match) => match.route.view) ?? [];
    }

    return this.matches;
  }
}

export const useHvLocation = () => {
  const location = useLocationReactRouter();
  const { mainPanel } = useHvAppShellModel();

  return useMemo(() => {
    return new LocationWithViews(location, mainPanel?.views);
  }, [location, mainPanel?.views]);
};
