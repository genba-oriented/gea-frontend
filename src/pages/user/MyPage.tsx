import { RatedUser } from "@/components/review/RatedUser";
import { LabelAndValue } from "@/components/util/LabelAndValue";
import { UserDto } from "@/dto/user/UserDto";
import { useLoginUserModel } from "@/model/user/LoginUserModelProvider";
import { useApi } from "@/util/ApiProvider";
import { currency } from "@/util/formatter";
import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export const MyPage = observer(() => {
  const loginUserModel = useLoginUserModel();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [me, setMe] = useState<UserDto>(null);
  const [ratedUser, setRatedUser] = useState(null);
  const api = useApi();
  useEffect(() => {
    api.fetch("/api/user/users/me").then(res => res.json()).then(data => setMe(data));
    api.fetch(`/api/review/rated-users/${loginUserModel.id}`).then(res => res.json()).then(data => setRatedUser(data));
  }, []);

  if (me == null || ratedUser == null) {
    return null;
  }

  return (
    <>
      <Stack alignItems="center" spacing={2}>
        <RatedUser ratedUserDto={ratedUser} />
        <LabelAndValue label="残高" labelWidth="100px" value={currency(me.balance)} />
        <Link to="/sell/list">出品した商品を見る</Link>
        <Link to="/buy/list">購入した商品を見る</Link>
        <Link to="/sell/selling">新しく出品する</Link>
        <Button
          onClick={() => {
            setLogoutDialogOpen(true);
          }}
        >ログアウト</Button>
      </Stack>
      <Dialog open={logoutDialogOpen} onClose={() => {
        setLogoutDialogOpen(false);
      }}>
        <DialogTitle>ログアウト</DialogTitle>
        <Stack padding={1} spacing={1} alignItems="center">
          <Typography>ログアウトしますか？</Typography>
          <Stack direction="row">
            <Button
              onClick={async () => {
                await loginUserModel.logout();
                navigate("/");
              }}
            >はい</Button>
            <Button
              onClick={() => {
                setLogoutDialogOpen(false);
              }}
            >いいえ</Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );

});