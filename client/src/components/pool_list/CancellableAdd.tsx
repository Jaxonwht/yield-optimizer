import * as React from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

interface CancellableAddProps {
  onSubmitOrCancel?: () => void;
}

const CancellableAdd = ({ onSubmitOrCancel }: CancellableAddProps) => {
  const [poolListName, setPoolListName] = React.useState<string>("");
  const [poolNames, setPoolNames] = React.useState<string>("");

  const onTextFieldChange = React.useCallback(
    (setStateFunction: (newStateValue: string) => void) =>
      (event: React.ChangeEvent<HTMLInputElement>) =>
        setStateFunction(event.target.value),
    []
  );

  const finisher = React.useCallback(() => {
    setPoolListName("");
    setPoolNames("");
    onSubmitOrCancel?.();
  }, [onSubmitOrCancel]);

  const onClickSubmit = React.useCallback(async () => {
    try {
      await axios.put("add-pool-list", {
        list_name: poolListName,
        pool_list: poolNames?.split(","),
      });
      finisher();
    } catch (error) {
      console.error(error);
    }
  }, [poolListName, poolNames, finisher]);

  return (
    <>
      <TextField
        id="pool-list-name"
        label="pool list name"
        variant="standard"
        value={poolListName}
        onChange={onTextFieldChange(setPoolListName)}
      ></TextField>
      <TextField
        id="pool-names"
        label="pool names"
        variant="standard"
        value={poolNames}
        onChange={onTextFieldChange(setPoolNames)}
      ></TextField>
      <Button onClick={onClickSubmit}>Submit</Button>
      <Button onClick={finisher}>Cancel</Button>
    </>
  );
};

export default CancellableAdd;
