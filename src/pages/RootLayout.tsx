import { LoginUser } from "@/components/user/LoginUser";
import { LoginUserModel } from "@/model/user/LoginUserModel";
import { LoginUserModelProvider } from "@/model/user/LoginUserModelProvider";
import { ErrorDialogModel } from "@/model/util/ErrorDialogModel";
import { ErrorDialogModelProvider } from "@/model/util/ErrorDialogModelProvider";
import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { theme } from "@/util/mui-theme";
import { Box, Container, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { ErrorDialog } from "./ErrorDialog";

export const RootLayout = observer(() => {

  const [loaded, setLoaded] = useState(false);
  const [{ api, userModel, errorDialogModel }] = useState(() => {
    const errorDialogModel = new ErrorDialogModel();
    const api = new Api(errorDialogModel);
    const userModel = new LoginUserModel(api);
    return { api, userModel, errorDialogModel };
  });

  useEffect(() => {
    userModel.load().then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <CssBaseline />
      <TitleChange />
      <ErrorDialogModelProvider value={errorDialogModel}>
        <ApiProvider value={api}>
          <LoginUserModelProvider value={userModel}>
            <ThemeProvider theme={theme}>
              <Container maxWidth="xl" sx={{ height: "100%", pt: "10px" }}>
                <Stack sx={{ height: "100%" }} spacing={1}>
                  <Header />
                  <Box sx={{ flexGrow: 1 }}>
                    <Outlet />
                  </Box>
                  <Footer />
                </Stack>
              </Container>
              <ErrorDialog />
            </ThemeProvider>
          </LoginUserModelProvider>
        </ApiProvider>
      </ErrorDialogModelProvider>
    </>
  );
});

const Header = () => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center">
      <Box
        sx={{ p: 1, borderRadius: 2, border: "1px solid lightgray", color: "gray", fontSize: "1.2em", cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        フリマアプリ
      </Box>
      <Box sx={{ flexGrow: 1 }}></Box>
      <LoginUser />
    </Stack>
  );
};

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
      Copyright フリマアプリ
    </Box>
  );
}
const TitleChange = () => {
  useEffect(() => {
    document.title = "フリマアプリ";
  }, []);
  return (
    <></>
  );
};

