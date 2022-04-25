import * as React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import {
  lastQueryTimeSelector,
  setLastQueryTime,
  POOL_LISTS_API_REDUX_KEY,
} from "state/features/lastQueryTimeSlice";
import {
  loadPoolLists,
  poolListsSelector,
} from "state/features/poolListsSlice";

interface CommonPoolListsSelectorProps {
  readonly candidatePoolListName: string;
  readonly setCandidatePoolListName: (newCandidatePoolName: string) => void;
}

interface PoolListsMultiSelectorProps {
  readonly multiple: true;
  readonly chosenPoolListNames: string[];
  readonly setChosenPoolListNames: (newChosenPoolNames: string[]) => void;
}

interface PoolListsSingleSelectorProps {
  readonly multiple?: false;
  readonly chosenPoolListName: string | null;
  readonly setChosenPoolListName: (newChosenPoolName: string | null) => void;
}

const PoolListsSelector = ({
  candidatePoolListName,
  setCandidatePoolListName,
  ...otherProps
}: CommonPoolListsSelectorProps &
  (PoolListsSingleSelectorProps | PoolListsMultiSelectorProps)) => {
  const lastQueryTime = useTypedSelector(
    lastQueryTimeSelector(POOL_LISTS_API_REDUX_KEY)
  );
  const dispatch = useTypedDispatch();
  const loadPoolListsAndUpdateQueryTime = async () => {
    await loadPoolLists(dispatch);
    setLastQueryTime(dispatch, [POOL_LISTS_API_REDUX_KEY, Date.now()]);
  };
  React.useEffect(() => {
    loadPoolListsAndUpdateQueryTime();
  }, []);
  const onInputNameChange = (candidatePoolList: string) => {
    if (Date.now() - lastQueryTime >= 60 * 1000) {
      // 60s
      loadPoolListsAndUpdateQueryTime();
    }
    setCandidatePoolListName(candidatePoolList);
  };
  const allPoolListNames = useTypedSelector(poolListsSelector);
  const commonProps = {
    inputValue: candidatePoolListName,
    onInputChange: (_: unknown, candidatePoolList: string) =>
      onInputNameChange(candidatePoolList),
    options: allPoolListNames,
    getOptionLabel: (option: string) => option,
  };

  return otherProps.multiple ? (
    <Autocomplete
      multiple
      value={otherProps.chosenPoolListNames}
      onChange={(_, newValue) => otherProps.setChosenPoolListNames(newValue)}
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
      value={otherProps.chosenPoolListName}
      onChange={(_, newValue) => otherProps.setChosenPoolListName(newValue)}
      renderInput={params => (
        <TextField {...params} variant="standard" label="Pool list names" />
      )}
      {...commonProps}
    />
  );
};

export default PoolListsSelector;
