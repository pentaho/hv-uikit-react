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
import { useCallback } from "react";
import { useBeforeUnload, useLocation } from "react-router-dom";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";

const useClearLocationState = () => {
  const location = useLocation();
  const { navigate } = useHvNavigation();

  // This will only be called when the user reloads the page or navigates away from the app and is required when
  // the configuration changes (refresh is mandatory) so that useLocation `state` property is reset.
  useBeforeUnload(
    useCallback(() => {
      navigate({ ...location }, { replace: true });
    }, [location, navigate]),
  );
};

export default useClearLocationState;
