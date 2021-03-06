import * as React from "react";
import ShrunkLabelTextField from "components/common/ShrunkLabelTextField";
import { COMMON_RESAMPLING_INTERVALS } from "./commonResamplingIntervals";
import { Button, FormControlLabel, MenuItem, Switch } from "@mui/material";
import axios from "axios";
import qs from "qs";
import ReactJson from "react-json-view";
import type { OptimizerResult } from "components/api_response/types";
import moment from "moment";
import PoolsSelector from "../pools/PoolsSelector";
import PoolListsSelector from "../pool_list/PoolListsSelector";

const Optimizer = () => {
  const [usePoolList, setUsePoolList] = React.useState(false);
  const [textInputs, setTextInputs] = React.useState({
    startTime: moment
      .utc()
      .subtract(1, "month")
      .format(moment.HTML5_FMT.DATETIME_LOCAL),
    endTime: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL),
    k: "10",
    resamplingInterval: "T",
  });

  const [chosenPoolNames, setChosenPoolNames] = React.useState<string[]>([]);
  const [candidatePoolName, setCandidatePoolName] = React.useState("");

  const [chosenPoolListName, setChosenPoolListName] = React.useState<
    string | null
  >(null);
  const [candidatePoolListName, setCandidatePoolListName] = React.useState("");

  const [optimizerResult, setOptimizerResult] =
    React.useState<OptimizerResult | null>(null);

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputs(prevTextInputs => ({
      ...prevTextInputs,
      [event.target.name]: event.target.value,
    }));
  };

  const onClickSubmit = async () => {
    const requestConfig = {
      params: {
        start_time: textInputs.startTime,
        end_time: textInputs.endTime,
        k: parseFloat(textInputs.k),
        resampling_interval: textInputs.resamplingInterval,
        [usePoolList ? "pool_list_name" : "pool_names"]: usePoolList
          ? chosenPoolListName
          : chosenPoolNames,
      },
      paramsSerializer: (params: unknown) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    };

    const apiRoute = usePoolList
      ? "/get-optimized-allocation-by-pool-list-name"
      : "/get-optimized-allocation-by-pool-names";

    try {
      const response = await axios.get(apiRoute, requestConfig);
      setOptimizerResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormControlLabel
        label="Query with pool list"
        control={
          <Switch
            checked={usePoolList}
            onChange={() => setUsePoolList(prevState => !prevState)}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />
      <div>
        {usePoolList ? (
          <PoolListsSelector
            chosenPoolListName={chosenPoolListName}
            setChosenPoolListName={setChosenPoolListName}
            candidatePoolListName={candidatePoolListName}
            setCandidatePoolListName={setCandidatePoolListName}
          />
        ) : (
          <PoolsSelector
            multiple
            chosenPoolNames={chosenPoolNames}
            setChosenPoolNames={setChosenPoolNames}
            candidatePoolName={candidatePoolName}
            setCandidatePoolName={setCandidatePoolName}
          />
        )}
        <ShrunkLabelTextField
          type="datetime-local"
          id="start-time"
          label="start time in UTC"
          variant="standard"
          name="startTime"
          value={textInputs.startTime}
          onChange={onTextInputChange}
        />
        <ShrunkLabelTextField
          type="datetime-local"
          id="end-time"
          label="end time in UTC"
          variant="standard"
          name="endTime"
          value={textInputs.endTime}
          onChange={onTextInputChange}
        />
        <ShrunkLabelTextField
          id="k"
          label="k"
          variant="standard"
          name="k"
          inputProps={{ inputMode: "decimal", pattern: "[0-9]*.[0-9]*" }}
          value={textInputs.k}
          onChange={onTextInputChange}
        />
        <ShrunkLabelTextField
          id="resampling-interval"
          label="resampling interval"
          variant="standard"
          name="resamplingInterval"
          value={textInputs.resamplingInterval}
          onChange={onTextInputChange}
          select
        >
          {COMMON_RESAMPLING_INTERVALS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </ShrunkLabelTextField>
      </div>
      <Button onClick={onClickSubmit}>Get optimized allocation!</Button>
      {optimizerResult && <ReactJson src={optimizerResult} />}
    </>
  );
};

export default Optimizer;
