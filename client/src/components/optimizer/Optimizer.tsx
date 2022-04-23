import * as React from "react";
import ShrunkLabelTextField from "components/common/ShrunkLabelTextField";
import { COMMON_RESAMPLING_INTERVALS } from "./commonResamplingIntervals";
import { Button, MenuItem } from "@mui/material";
import axios from "axios";
import { splitCommaSeparatedString } from "utils/stringUtils";
import qs from "qs";

const Optimizer = () => {
  const [textInputs, setTextInputs] = React.useState({
    poolNames: "",
    startTime: "",
    endTime: "",
    k: "1",
    resamplingInterval: "D",
  });
  const [bestRatios, setBestRatios] = React.useState("");

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputs(prevTextInputs => ({
      ...prevTextInputs,
      [event.target.name]: event.target.value,
    }));
  };
  const onClickSubmit = async () => {
    try {
      const response = await axios.get(
        "/get-optimized-allocation-by-pool-names",
        {
          params: {
            pool_names: splitCommaSeparatedString(textInputs.poolNames),
            start_time: textInputs.startTime,
            end_time: textInputs.endTime,
            k: parseFloat(textInputs.k),
            resampling_interval: textInputs.resamplingInterval,
          },
          paramsSerializer: params => qs.stringify(params),
        }
      );
      setBestRatios(JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <ShrunkLabelTextField
        id="pool-names"
        label="pool names"
        variant="standard"
        name="poolNames"
        value={textInputs.poolNames}
        onChange={onTextInputChange}
        required
      />
      <ShrunkLabelTextField
        type="datetime-local"
        id="start-time"
        label="start time"
        variant="standard"
        name="startTime"
        value={textInputs.startTime}
        onChange={onTextInputChange}
      />
      <ShrunkLabelTextField
        type="datetime-local"
        id="end-time"
        label="end time"
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
      <br />
      <Button onClick={onClickSubmit}>Get optimized allocation!</Button>
      <br />
      {bestRatios && <div>{bestRatios}</div>}
    </>
  );
};

export default Optimizer;
