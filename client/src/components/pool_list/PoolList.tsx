import * as React from "react";
import axios from "axios";
import { ListItem, List, Button, ListItemText } from "@mui/material";
import CancellableAdd from "./CancellableAdd";

const PoolList = () => {
  const [poolListNames, setPoolListNames] = React.useState<string[]>([]);
  const [isAddingPoolList, setIsAddingPoolList] = React.useState(false);

  const onClickAdd = React.useCallback(() => setIsAddingPoolList(true), []);

  const onCloseAdd = React.useCallback(() => setIsAddingPoolList(false), []);

  const onClickGet = React.useCallback(async () => {
    try {
      const response = await axios.get("/get-all-pool-list-names");
      setPoolListNames((response.data as string[])?.slice(0, 20));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <Button variant="contained" onClick={onClickGet}>
        Get all pool lists!
      </Button>
      <List>
        {poolListNames.map(poolListName => (
          <ListItem key={poolListName}>
            <ListItemText primary={poolListName} />
          </ListItem>
        ))}
      </List>
      {isAddingPoolList ? (
        <CancellableAdd onSubmitOrCancel={onCloseAdd} />
      ) : (
        <Button variant="contained" onClick={onClickAdd}>
          Add new pool list!
        </Button>
      )}
    </>
  );
};

export default PoolList;
