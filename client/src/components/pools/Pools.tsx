import * as React from "react";
import { Alert, Button } from "@mui/material";
import { loadPools } from "state/features/poolsSlice";
import { useTypedDispatch } from "state/hooks";
import type { PoolInformation } from "components/api_response/types";
import axios from "axios";
import {
  setLastQueryTime,
  POOLS_API_REDUX_KEY,
} from "state/features/lastQueryTimeSlice";
import ReactJson from "react-json-view";
import PoolsSelector from "./PoolsSelector";

const Pools = () => {
  const dispatch = useTypedDispatch();
  const [chosenPool, setChosenPool] = React.useState<string | null>(null);
  const [candidatePool, setCandidatePool] = React.useState("");
  const [poolDetail, setPoolDetail] = React.useState<PoolInformation | null>(
    null
  );

  const loadPoolsAndUpdateQueryTime = async () => {
    await loadPools(dispatch);
    setLastQueryTime(dispatch, [POOLS_API_REDUX_KEY, Date.now()]);
  };

  React.useEffect(() => {
    loadPoolsAndUpdateQueryTime();
  }, []);

  const confirmChosenPool = async (chosenPool: string | null) => {
    setChosenPool(chosenPool);
    if (chosenPool !== null) {
      setPoolDetail({ loading: true });
      try {
        const response = await axios.get(
          `/get-information-about-pool/${chosenPool}`
        );
        setPoolDetail((response.data as PoolInformation) ?? null);
      } catch (error) {
        setPoolDetail(null);
        console.error(error);
      }
    }
  };

  return (
    <>
      <Button variant="contained" onClick={loadPoolsAndUpdateQueryTime}>
        Refresh all pools!
      </Button>
      <PoolsSelector
        chosenPoolName={chosenPool}
        setChosenPoolName={confirmChosenPool}
        candidatePoolName={candidatePool}
        setCandidatePoolName={setCandidatePool}
      />
      {poolDetail &&
        (poolDetail.loading ? (
          <Alert severity="info">
            Information about the pool is being loaded!
          </Alert>
        ) : (
          <ReactJson src={poolDetail} />
        ))}
    </>
  );
};

export default Pools;
