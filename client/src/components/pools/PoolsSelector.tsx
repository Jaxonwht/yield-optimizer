import * as React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { poolsSelector, loadPools } from "state/features/poolsSlice";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import {
  lastQueryTimeSelector,
  setLastQueryTime,
  POOLS_API_REDUX_KEY,
} from "state/features/lastQueryTimeSlice";

interface CommonPoolsSelectorProps {
  readonly candidatePoolName: string;
  readonly setCandidatePoolName: (newCandidatePoolName: string) => void;
}

interface PoolsMultiSelectorProps {
  readonly multiple: true;
  readonly chosenPoolNames: string[];
  readonly setChosenPoolNames: (newChosenPoolNames: string[]) => void;
}

interface PoolsSingleSelectorProps {
  readonly multiple?: false;
  readonly chosenPoolName: string | null;
  readonly setChosenPoolName: (newChosenPoolName: string | null) => void;
}

const PoolsSelector = ({
  candidatePoolName,
  setCandidatePoolName,
  ...otherProps
}: CommonPoolsSelectorProps &
  (PoolsSingleSelectorProps | PoolsMultiSelectorProps)) => {
  const lastQueryTime = useTypedSelector(
    lastQueryTimeSelector(POOLS_API_REDUX_KEY)
  );
  const dispatch = useTypedDispatch();
  const loadPoolsAndUpdateQueryTime = async () => {
    await loadPools(dispatch);
    setLastQueryTime(dispatch, [POOLS_API_REDUX_KEY, Date.now()]);
  };
  React.useEffect(() => {
    loadPoolsAndUpdateQueryTime();
  }, []);
  const onInputNameChange = (candidatePool: string) => {
    if (Date.now() - lastQueryTime >= 60 * 1000) {
      // 60s
      loadPoolsAndUpdateQueryTime();
    }
    setCandidatePoolName(candidatePool);
  };
  const allPoolNames = useTypedSelector(poolsSelector);
  const commonProps = {
    inputValue: candidatePoolName,
    onInputChange: (_: unknown, candidatePool: string) =>
      onInputNameChange(candidatePool),
    options: allPoolNames,
    getOptionLabel: (option: string) => option,
  };

  return otherProps.multiple ? (
    <Autocomplete
      multiple
      value={otherProps.chosenPoolNames}
      onChange={(_, newValue) => otherProps.setChosenPoolNames(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          variant="standard"
          label="Pool names"
          placeholder="Favorites"
        />
      )}
      {...commonProps}
    />
  ) : (
    <Autocomplete
      value={otherProps.chosenPoolName}
      onChange={(_, newValue) => otherProps.setChosenPoolName(newValue)}
      renderInput={params => (
        <TextField {...params} variant="standard" label="Pool names" />
      )}
      {...commonProps}
    />
  );
};

export default PoolsSelector;
