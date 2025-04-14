import { Box, Button, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router";

export const LoginPage = () => {
  const location = useLocation();

  return (
    <Stack textAlign="center" spacing={2}>
      <Typography variant="h5">Googleアカウントへのログインが必要です</Typography>
      <Box>
        <Button href={"/start-auth" + location.search} >Login with Google</Button>
      </Box>
    </Stack>
  );

};