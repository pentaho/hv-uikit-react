import { lazy } from "react";

import { MainContainer } from "../../components/MainContainer";

const ListView = lazy(() => import("@hv/templates/ListView"));

const ListViewWithContainer = () => (
  <MainContainer>
    <ListView />
  </MainContainer>
);

export default ListViewWithContainer;
