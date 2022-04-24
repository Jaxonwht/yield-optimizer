import * as React from "react";
import { Button, TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import { poolsSelector, loadPools } from "state/features/poolsSlice";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import {
  lastQueryTimeSelector,
  setLastQueryTime,
  POOLS_API_REDUX_KEY,
} from "state/features/lastQueryTimeSlice";

interface CancellableAddProps {
  onSubmitOrCancel?: () => void;
}

const onTextFieldChange =
  (setStateFunction: (newStateValue: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    setStateFunction(event.target.value);

const CancellableAdd = ({ onSubmitOrCancel }: CancellableAddProps) => {
  const [poolListName, setPoolListName] = React.useState<string>("");

  const lastQueryTime = useTypedSelector(
    lastQueryTimeSelector(POOLS_API_REDUX_KEY)
  );
  const [chosenPoolNames, setChosenPoolNames] = React.useState<string[]>([]);
  const [candidatePoolName, setCandidatePoolName] = React.useState("");

  const dispatch = useTypedDispatch();

  const finisher = () => {
    setPoolListName("");
    setChosenPoolNames([]);
    setCandidatePoolName("");
    onSubmitOrCancel?.();
  };

  const onClickSubmit = async () => {
    try {
      await axios.put("/add-pool-list", {
        list_name: poolListName,
        pool_list: chosenPoolNames,
      });
      finisher();
    } catch (error) {
      console.error(error);
    }
  };

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
    setCandidatePoolName(candidatePool);
  };
  const allPoolNames = useTypedSelector(poolsSelector);

  return (
    <>
      <TextField
        id="pool-list-name"
        label="pool list name"
        variant="standard"
        value={poolListName}
        onChange={onTextFieldChange(setPoolListName)}
      />
      <Autocomplete
        multiple
        id="add-pools-to-list"
        value={chosenPoolNames}
        onChange={(_, chosenPools) => setChosenPoolNames(chosenPools)}
        inputValue={candidatePoolName}
        onInputChange={(_, candidatePool: string) =>
          onInputNameChange(candidatePool)
        }
        options={allPoolNames}
        getOptionLabel={option => option}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            label="Pool names"
            placeholder="Favorites"
          />
        )}
      />
      <Button onClick={onClickSubmit}>Submit</Button>
      <Button onClick={finisher}>Cancel</Button>
    </>
  );
};

export default CancellableAdd;
