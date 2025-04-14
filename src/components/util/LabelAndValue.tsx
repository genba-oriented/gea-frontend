import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";

export const LabelAndValue = ({ label, labelWidth, value }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box width={labelWidth}>
        <Chip label={label} sx={{ width: labelWidth }} />
      </Box>
      {React.isValidElement(value) ? value : <Typography>{value}</Typography>}
    </Stack>
  );
}