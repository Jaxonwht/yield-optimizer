import { TextField, TextFieldProps } from "@mui/material";
import * as React from "react";

const ShrunkLabelTextField = (props: TextFieldProps) => {
  const propsWithShrunkLabel = {
    ...props,
    InputLabelProps: {
      shrink: true,
    },
  };
  return <TextField {...propsWithShrunkLabel} />;
};

export default ShrunkLabelTextField;
