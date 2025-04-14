import { useLoginUserModel } from '@/model/user/LoginUserModelProvider';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { Link, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { Link as RouterLink, useNavigate } from 'react-router';


export const LoginUser = observer(() => {

  const userModel = useLoginUserModel();
  const navigate = useNavigate();
  const name = userModel.name != null ? userModel.name : userModel.email;

  return (
    <>
      {userModel.logined ?
        <Stack direction="row" alignItems="center">
          <Typography>{name}さん</Typography>
          <Stack alignItems="center" sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/mypage");
            }}
          >
            <PermIdentityOutlinedIcon />
            <Typography sx={{ fontSize: "0.9em" }}>マイページ</Typography>
          </Stack>
        </Stack >
        :
        <Stack direction="row">
          <Link component={RouterLink} to="/login">ログイン</Link>
          <Typography>/</Typography>
          <Link component={RouterLink} to={"/login?" + new URLSearchParams({
            afterAuth: "/user/register"
          }).toString()}>サインイン</Link>
        </Stack>
      }
    </>
  );
});


