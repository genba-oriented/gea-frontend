import { Stack, Typography } from "@mui/material";

export const AbsolutePositionSoldBadge = ({ width, height }) => {
  return (
    <Stack sx={{
      height: height, width: width, backgroundColor: "white",
      position: "absolute", top: 0, bottom: 0, left: 0, right: 0, margin: "auto",
      border: 1, borderColor: "red", justifyContent: "center"
    }}>
      <Typography sx={{ color: "red", textAlign: "center" }}>Sold</Typography>
    </Stack>
  );
}