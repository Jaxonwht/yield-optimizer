import { ListItemButton, ListItemText, List } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import axios from "axios";
import { PoolInList } from "../api_response/types";

interface PoolListEntryProps {
  poolListName: string;
  onDeleteClicked?: () => void;
}

const PoolListEntry = (props: PoolListEntryProps) => {
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

  const handleTrashCanClicked = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await axios.delete(`/delete-pool-list-by-name/${props.poolListName}`);
      props.onDeleteClicked?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleClickOnPoolList(props.poolListName)}>
        <ListItemText primary={props.poolListName} />
        <DeleteIcon onClick={event => handleTrashCanClicked(event)} />
      </ListItemButton>
      {isShowingPoolList && (
        <List>
          {poolsInList.map(poolName => {
            return <ListItemText key={poolName} primary={poolName} />;
          })}
        </List>
      )}
    </>
  );
};

export default PoolListEntry;
