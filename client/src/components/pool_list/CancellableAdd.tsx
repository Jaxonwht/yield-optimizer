import * as React from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import PoolsSelector from "../pools/PoolsSelector";

interface CancellableAddProps {
  onSubmitOrCancel?: () => void;
}

const CancellableAdd = ({ onSubmitOrCancel }: CancellableAddProps) => {
  const [poolListName, setPoolListName] = React.useState<string>("");
  const [chosenPoolNames, setChosenPoolNames] = React.useState<string[]>([]);
  const [candidatePoolName, setCandidatePoolName] = React.useState("");

  const finisher = () => {
    setPoolListName("");
    setChosenPoolNames([]);
    setCandidatePoolName("");
    onSubmitOrCancel?.();
  };

  const onClickSubmit = async () => {
    try {
      await axios.put("/add-pool-list", {
        list_name: poolListName,
        pool_list: chosenPoolNames,
      });
      finisher();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TextField
        id="pool-list-name"
        label="pool list name"
        variant="standard"
        value={poolListName}
        onChange={event => setPoolListName(event.target.value)}
      />
      <PoolsSelector
        multiple
        chosenPoolNames={chosenPoolNames}
        setChosenPoolNames={setChosenPoolNames}
        candidatePoolName={candidatePoolName}
        setCandidatePoolName={setCandidatePoolName}
      />
      <Button onClick={onClickSubmit}>Submit</Button>
      <Button onClick={finisher}>Cancel</Button>
    </>
  );
};

export default CancellableAdd;
