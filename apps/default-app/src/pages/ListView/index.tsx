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
import { lazy } from "react";

import { MainContainer } from "../../components/MainContainer";

const ListView = lazy(() => import("@hv/templates/ListView"));

const ListViewWithContainer = () => (
  <MainContainer>
    <ListView />
  </MainContainer>
);

export default ListViewWithContainer;
