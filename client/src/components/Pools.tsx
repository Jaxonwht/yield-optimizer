import * as React from "react";
import axios from "axios";
import { ListItem, List, Button, ListItemText, TextField } from "@mui/material";

const Pools = () => {
  const [poolList, setPoolList] = React.useState<string[]>([]);
  const [searchName, setSearchName] = React.useState("");
  const [lastQueryTime, setLastQueryTime] = React.useState(0);

  const getPools = async () => {
    try {
      const response = await axios.get("/get-all-pools");
      setPoolList((response.data as string[]) ?? []);
      setLastQueryTime(Date.now());
    } catch (err) {
      console.error(err);
    }
  };

  const onSearchNameChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
    if (Date.now() - lastQueryTime >= 60 * 1000) {
      // 60s
      await getPools();
    }
  };

  const filteredPoolList = poolList
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
      <Button variant="contained" onClick={getPools}>
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
