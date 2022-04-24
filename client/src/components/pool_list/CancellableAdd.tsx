import * as React from "react";
import { splitCommaSeparatedString } from "utils/stringUtils";
import { Button, TextField } from "@mui/material";
import axios from "axios";

interface CancellableAddProps {
  onSubmitOrCancel?: () => void;
}

const onTextFieldChange =
  (setStateFunction: (newStateValue: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    setStateFunction(event.target.value);

const CancellableAdd = ({ onSubmitOrCancel }: CancellableAddProps) => {
  const [poolListName, setPoolListName] = React.useState<string>("");
  const [poolNames, setPoolNames] = React.useState<string>("");

  const finisher = () => {
    setPoolListName("");
    setPoolNames("");
    onSubmitOrCancel?.();
  };

  const onClickSubmit = async () => {
    try {
      await axios.put("/add-pool-list", {
        list_name: poolListName,
        pool_list: splitCommaSeparatedString(poolNames),
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
        onChange={onTextFieldChange(setPoolListName)}
      />
      <TextField
        id="pool-names"
        label="pool names"
        variant="standard"
        value={poolNames}
        onChange={onTextFieldChange(setPoolNames)}
      />
      <Button onClick={onClickSubmit}>Submit</Button>
      <Button onClick={finisher}>Cancel</Button>
    </>
  );
};

export default CancellableAdd;
