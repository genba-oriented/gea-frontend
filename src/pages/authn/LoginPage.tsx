import { Box, Button, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router";

export const LoginPage = () => {
  const location = useLocation();

  return (
    <Stack textAlign="center" spacing={2}>
      <Typography variant="h5">IdPへのログインが必要です</Typography>
      <Box>
        <Button href={"/login" + location.search} >Login with IdP</Button>
      </Box>
    </Stack>
  );

};