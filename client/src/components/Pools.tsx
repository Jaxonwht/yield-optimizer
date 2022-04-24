import * as React from "react";
import { ListItem, List, Button, ListItemText, TextField } from "@mui/material";
import { poolsSelector, loadPools } from "state/features/poolsSlice";
import { useTypedDispatch, useTypedSelector } from "state/hooks";
import {
  lastQueryTimeSelector,
  setLastQueryTime,
} from "state/features/lastQueryTimeSlice";

const POOLS_API_REDUX_KEY = "get-pools";

const Pools = () => {
  const [searchName, setSearchName] = React.useState("");
  const pools = useTypedSelector(poolsSelector);
  const lastQueryTime = useTypedSelector(
    lastQueryTimeSelector(POOLS_API_REDUX_KEY)
  );
  const dispatch = useTypedDispatch();

  const loadPoolsAndUpdateQueryTime = () => {
    loadPools(dispatch);
    setLastQueryTime(dispatch, [POOLS_API_REDUX_KEY, Date.now()]);
  };

  const onSearchNameChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
    if (Date.now() - lastQueryTime >= 60 * 1000) {
      // 60s
      loadPoolsAndUpdateQueryTime();
    }
  };

  const filteredPoolList = pools
    .filter(
      poolName => searchName == "" || poolName.match(new RegExp(searchName))
    )
    .slice(0, 20);

  return (
    <>
      <TextField
        id="pool-names-search-bar"
        label="Search"
        variant="outlined"
        value={searchName}
        onChange={onSearchNameChange}
      />
      <Button variant="contained" onClick={loadPoolsAndUpdateQueryTime}>
        Get all pools!
      </Button>
      <List>
        {filteredPoolList.map(poolName => (
          <ListItem key={poolName}>
            <ListItemText primary={poolName} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Pools;
