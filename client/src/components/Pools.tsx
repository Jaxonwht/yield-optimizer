import * as React from "react";
import axios from "axios";
import { ListItem, List, Button, ListItemText } from "@mui/material";

const Pools = () => {
  const [poolList, setPoolList] = React.useState<string[]>([]);
  const onClick = React.useCallback(async () => {
    try {
      const response = await axios.get("/get-all-pools");
      setPoolList(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <Button variant="contained" onClick={onClick}>
        Get all pools!
      </Button>
      <List>
        {poolList.map(poolName => (
          <ListItem key={poolName}>
            <ListItemText primary={poolName} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Pools;
