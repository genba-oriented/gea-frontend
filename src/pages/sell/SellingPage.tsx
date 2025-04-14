import { SellForm } from "@/components/sell/SellForm";
import { ProductImageEditModel } from "@/model/sell/ProductImageEditModel";
import { ValidatableForm } from "@/model/util/ValidatableForm";
import { lastSegment } from "@/util/api-utils";
import { useApi } from "@/util/ApiProvider";
import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export const SellingPage = observer(() => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sellId, setSellId] = useState(null);

  const api = useApi();
  const [productImageEditModel] = useState(new ProductImageEditModel(api));

  const doSell = async (form: ValidatableForm) => {
    const body = form.getValuesAsObject();
    const res = await api.fetch("/api/sell/sells", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const sellLocation = res.headers.get("Location");
    const sellId = lastSegment(sellLocation);
    await productImageEditModel.doSync(sellId);

    setSellId(sellId);
    setOpen(true);

  };

  const cancel = () => {
    navigate(`/sell/list`);
  };


  return (
    <>
      <Stack alignItems="center" spacing={1}>
        <Typography sx={{ textAlign: "center" }} variant="h5">出品画面</Typography>
        <SellForm sellDto={null} action={doSell} actionLabel="出品する" cancel={cancel} productImageEditModel={productImageEditModel} />
      </Stack>
      <SuccessDialog open={open} setOpen={setOpen} sellId={sellId} />
    </>
  );

});

const SuccessDialog = ({ open, setOpen, sellId }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={() => {
      setOpen(false);
      navigate(`/sell/detail/${sellId}`);
    }}>
      <DialogTitle>商品を出品しました</DialogTitle>
      <Stack padding={1} spacing={1} alignItems="center">
        <Button onClick={() => {
          setOpen(false);
          navigate(`/sell/detail/${sellId}`);
        }}>OK</Button>
      </Stack>
    </Dialog>
  );
};
