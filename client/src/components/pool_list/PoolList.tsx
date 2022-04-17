import * as React from "react";
import axios from "axios";
import { List, Button, ListItemText, ListItemButton } from "@mui/material";
import CancellableAdd from "./CancellableAdd";
import { PoolInList } from "../api_response/types";

const PoolList = () => {
  const [poolListNames, setPoolListNames] = React.useState<string[]>([]);
  const [isAddingPoolList, setIsAddingPoolList] = React.useState(false);
  const [isShowingPoolList, setIsShowingPoolList] = React.useState(false);
  const [poolsInList, setPoolsInList] = React.useState<string[]>([]);

  const handleClickOnPoolList = React.useCallback(
    (poolListName: string) => async () => {
      setIsShowingPoolList(prevState => !prevState);
      try {
        const response = await axios.get(
          `/get-pools-by-list-name/${poolListName}`
        );
        setPoolsInList(
          (response.data as PoolInList[])?.map(info => info.pool_name)
        );
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const onClickAdd = () => setIsAddingPoolList(true);

  const onCloseAdd = () => setIsAddingPoolList(false);

  const onClickGet = async () => {
    try {
      const response = await axios.get("/get-all-pool-list-names");
      setPoolListNames((response.data as string[])?.slice(0, 20));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={onClickGet}>
        Get all pool lists!
      </Button>
      <List>
        {poolListNames.map(poolListName => (
          <React.Fragment key={poolListName}>
            <ListItemButton onClick={handleClickOnPoolList(poolListName)}>
              <ListItemText primary={poolListName} />
            </ListItemButton>
            {isShowingPoolList && (
              <List>
                {poolsInList.map(poolName => {
                  return <ListItemText key={poolName} primary={poolName} />;
                })}
              </List>
            )}
          </React.Fragment>
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
