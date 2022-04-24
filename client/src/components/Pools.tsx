import * as React from "react";
import { Alert, Button, TextField, Autocomplete } from "@mui/material";
import { poolsSelector, loadPools } from "state/features/poolsSlice";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import type { PoolInformation } from "./api_response/types";
import axios from "axios";
import {
  lastQueryTimeSelector,
  setLastQueryTime,
  POOLS_API_REDUX_KEY,
} from "state/features/lastQueryTimeSlice";
import ReactJson from "react-json-view";

const Pools = () => {
  const pools = useTypedSelector(poolsSelector);
  const lastQueryTime = useTypedSelector(
    lastQueryTimeSelector(POOLS_API_REDUX_KEY)
  );
  const dispatch = useTypedDispatch();
  const [chosenPool, setChosenPool] = React.useState<string | null>(null);
  const [inputPools, setInputPool] = React.useState("");
  const [poolDetail, setPoolDetail] = React.useState<PoolInformation | null>(
    null
  );

  const loadPoolsAndUpdateQueryTime = () => {
    loadPools(dispatch);
    setLastQueryTime(dispatch, [POOLS_API_REDUX_KEY, Date.now()]);
  };

  React.useEffect(() => loadPoolsAndUpdateQueryTime(), []);

  const onInputNameChange = (candidatePool: string) => {
    if (Date.now() - lastQueryTime >= 60 * 1000) {
      // 60s
      loadPoolsAndUpdateQueryTime();
    }
    setInputPool(candidatePool);
  };

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
      <Autocomplete
        id="tags-standard"
        value={chosenPool}
        onChange={(_, chosenPool) => confirmChosenPool(chosenPool)}
        inputValue={inputPools}
        onInputChange={(_, candidatePool) => onInputNameChange(candidatePool)}
        options={pools}
        getOptionLabel={option => option}
        renderInput={params => (
          <TextField {...params} variant="standard" label="Pool name" />
        )}
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
