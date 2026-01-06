import { useNavigate, useParams } from "react-router-dom";
import { css } from "@emotion/css";
import {
  HvActionBar,
  HvActionsGeneric,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const classes = {
  card: css({
    "& .HvCard-semanticBar": {
      backgroundColor: "#CC0000",
    },
  }),
};

type DetailsParams = {
  cardId: string;
  cardText: string;
};

const Details = () => {
  const navigate = useNavigate();
  const params = useParams<DetailsParams>();

  const { cardId, cardText } = params;

  const handleAction = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <HvCard bgcolor="bgContainer" className={classes.card}>
      <HvCardHeader title={`Selected card id: ${cardId}`} />
      <HvCardContent>
        <div style={{ paddingTop: "20px" }}>
          <HvTypography variant="label">{cardText}</HvTypography>
        </div>
      </HvCardContent>
      <HvActionBar>
        <HvActionsGeneric
          actions={[
            {
              id: "goBack",
              label: "Go back",
            },
          ]}
          onAction={handleAction}
        />
      </HvActionBar>
    </HvCard>
  );
};

export default Details;
