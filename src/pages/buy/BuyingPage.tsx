import { SellDetail } from "@/components/catalog/SellDetail";
import { LabelAndValue } from "@/components/util/LabelAndValue";
import { SellDto } from "@/dto/catalog/SellDto";
import { UserDto } from "@/dto/user/UserDto";
import { useErrorDialogModel } from "@/model/util/ErrorDialogModelProvider";
import { lastSegment } from "@/util/api-utils";
import { useApi } from "@/util/ApiProvider";
import { currency } from "@/util/formatter";
import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const BuyingPage = () => {
  const { sellId } = useParams();
  const [me, setMe] = useState<UserDto>(null);
  const api = useApi();
  const navigate = useNavigate();
  const [sell, setSell] = useState<SellDto>(null);
  const [open, setOpen] = useState(false);
  const [boughtBuyId, setBoughtBuyId] = useState(null);
  const errorDialogModel = useErrorDialogModel();

  useEffect(() => {
    api.fetch("/api/user/users/me").then(res => res.json()).then(data => setMe(data));
    api.fetch(`/api/catalog/sells/${sellId}`)
      .then(res => res.json())
      .then((data: SellDto) => setSell(data));
  }, []);

  if (me == null || sell == null) {
    return null;
  }

  return (
    <>
      <Stack spacing={1.5}>
        <Typography textAlign="center" variant="h5">商品購入画面</Typography>
        <SellDetail sell={sell} />
        <Stack alignItems="center" spacing={1}>
          <Typography textAlign="center" variant="h6">あなたの情報</Typography>
          <Stack spacing={1}>
            <LabelAndValue label="残高" labelWidth="100px" value={currency(me.balance)} />
            <LabelAndValue label="配送先" labelWidth="100px" value={me.shippingAddress} />
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button onClick={async () => {
            const body = {
              sellId: sellId
            };
            const res = await api.fetch("/api/buy/buys", {
              method: "POST",
              body: JSON.stringify(body)
            });
            if (res.status == 400) {
              const body = await res.json();
              if (body.cause == "BalanceShortage") {
                errorDialogModel.show("残高が足りません");
                return;
              } else if (body.cause == "AlreadyBought") {
                errorDialogModel.show("すでに購入されています");
                return;
              } else if (body.cause == "SellByMyself") {
                errorDialogModel.show("あなたが出品した商品なので購入できません");
                return;
              } else {
                errorDialogModel.show("想定しないエラーが発生しました");
                return;
              }
            }

            const location = res.headers.get("Location");
            setBoughtBuyId(lastSegment(location));
            setOpen(true);
          }}>購入する</Button>
          <Button
            onClick={() => {
              navigate(`/catalog/detail/${sellId}`);
            }}
          >キャンセル</Button>
        </Stack>
      </Stack>
      <BoughtDialog open={open} setOpen={setOpen} boughtBuyId={boughtBuyId} />
    </>
  )
};

const BoughtDialog = ({ open, setOpen, boughtBuyId }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={() => {
      setOpen(false);
      navigate(`/buy/detail/${boughtBuyId}`);
    }}>
      <DialogTitle>商品を購入しました</DialogTitle>
      <Stack padding={1} spacing={1} alignItems="center">
        <Button onClick={() => {
          setOpen(false);
          navigate(`/buy/detail/${boughtBuyId}`);
        }}>OK</Button>
      </Stack>
    </Dialog>
  );
};
