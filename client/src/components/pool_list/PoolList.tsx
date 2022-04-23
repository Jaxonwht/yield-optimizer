import * as React from "react";
import axios from "axios";
import { List, Button } from "@mui/material";
import PoolListEntry from "./PoolListEntry";
import CancellableAdd from "./CancellableAdd";

const PoolList = () => {
  const [poolListNames, setPoolListNames] = React.useState<string[]>([]);
  const [isAddingPoolList, setIsAddingPoolList] = React.useState(false);

  const onClickGet = async () => {
    try {
      const response = await axios.get("/get-all-pool-list-names");
      setPoolListNames((response.data as string[])?.slice(0, 20));
    } catch (error) {
      console.error(error);
    }
  };

  const removePoolList = (poolListName: string) =>
    setPoolListNames(prevPoolListNames =>
      prevPoolListNames.filter(name => name != poolListName)
    );

  const onDeleteClicked = React.useCallback(
    (poolListName: string) => removePoolList(poolListName),
    []
  );

  return (
    <>
      <Button variant="contained" onClick={onClickGet}>
        Get all pool lists!
      </Button>
      <List>
        {poolListNames.map(poolListName => (
          <PoolListEntry
            key={poolListName}
            poolListName={poolListName}
            onDeleteClicked={onDeleteClicked}
          />
        ))}
      </List>
      {isAddingPoolList ? (
        <CancellableAdd onSubmitOrCancel={() => setIsAddingPoolList(false)} />
      ) : (
        <Button variant="contained" onClick={() => setIsAddingPoolList(true)}>
          Add new pool list!
        </Button>
      )}
    </>
  );
};

export default PoolList;
