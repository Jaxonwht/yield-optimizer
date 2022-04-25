import * as React from "react";
import { List, Button } from "@mui/material";
import PoolListEntry from "./PoolListEntry";
import CancellableAdd from "./CancellableAdd";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import {
  loadPoolLists,
  poolListsSelector,
} from "state/features/poolListsSlice";
import {
  POOL_LISTS_API_REDUX_KEY,
  setLastQueryTime,
} from "state/features/lastQueryTimeSlice";

const PoolList = () => {
  const poolListNames = useTypedSelector(poolListsSelector);
  const [isAddingPoolList, setIsAddingPoolList] = React.useState(false);

  const dispatch = useTypedDispatch();
  const loadPoolListsAndUpdateQueryTime = async () => {
    await loadPoolLists(dispatch);
    setLastQueryTime(dispatch, [POOL_LISTS_API_REDUX_KEY, Date.now()]);
  };
  React.useEffect(() => {
    loadPoolListsAndUpdateQueryTime();
  }, []);

  return (
    <>
      <Button variant="contained" onClick={loadPoolListsAndUpdateQueryTime}>
        Get all pool lists!
      </Button>
      <List>
        {poolListNames.map(poolListName => (
          <PoolListEntry
            key={poolListName}
            poolListName={poolListName}
            onDeleteClicked={loadPoolListsAndUpdateQueryTime}
          />
        ))}
      </List>
      {isAddingPoolList ? (
        <CancellableAdd
          onSubmitOrCancel={async () => {
            setIsAddingPoolList(false);
            await loadPoolListsAndUpdateQueryTime();
          }}
        />
      ) : (
        <Button variant="contained" onClick={() => setIsAddingPoolList(true)}>
          Add new pool list!
        </Button>
      )}
    </>
  );
};

export default PoolList;
