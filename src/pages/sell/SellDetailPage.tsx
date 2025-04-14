import { ReviewForm } from "@/components/review/ReviewForm";
import { SellDetail } from "@/components/sell/SellDetail";
import { LabelAndValue } from "@/components/util/LabelAndValue";
import { BuyerDto } from "@/dto/buy/BuyerDto";
import { SellDto } from "@/dto/sell/SellDto";
import { useErrorDialogModel } from "@/model/util/ErrorDialogModelProvider";
import { useApi } from "@/util/ApiProvider";
import { Box, Button, Chip, Link, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";


export const SellDetailPage = () => {
  const { id } = useParams();
  const [sell, setSell] = useState<SellDto>(null);
  const api = useApi();
  useEffect(() => {
    api.fetch(`/api/sell/sells/${id}`).then(res => res.json()).then(
      data => setSell(data)
    );
  }, []);

  if (sell == null) {
    return null;
  }

  let statusSpecific = getStatusSpecific(sell);

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">出品した商品</Typography>
      <Box textAlign="center">
        <Chip sx={{ fontSize: "1.5em", padding: 1 }} label={statusSpecific.statusText} color="primary" />
      </Box>
      <SellDetail sellDto={sell} />
      {statusSpecific.tailComp}
      <Box textAlign="center">
        <Link component={RouterLink} to="/sell/list">一覧に戻る</Link>
      </Box>
    </Stack>
  )
};

function getStatusSpecific(sell: SellDto) {
  let statusText = null;
  let tailComp = null;
  switch (sell.status) {
    case "NOW_SELLING":
      statusText = "出品中";
      tailComp = <NowSelling sell={sell} />
      break;
    case "NEED_SHIPPING":
      statusText = "商品を発送してください";
      tailComp = <NeedShipping sell={sell} />
      break;
    case "NEED_REVIEW_BY_BUYER":
      statusText = "購入者の評価待ちです";
      tailComp = <ReviewByBuyer sell={sell} />
      break;
    case "NEED_REVIEW_BY_SELLER":
      statusText = "購入者を評価してください";
      tailComp = <ReviewBySeller sell={sell} />
      break;
    case "COMPLETED":
      statusText = "取引は終了しました";
      tailComp = <Completed sell={sell} />
      break;
  }

  return {
    statusText, tailComp
  }
}


const useBuyer = (sellId: string) => {
  const api = useApi();
  const [buyer, setBuyer] = useState<BuyerDto>(null);
  useEffect(() => {
    api.fetch("/api/buy/for-seller/buyers?" + new URLSearchParams({
      sellId: sellId
    }).toString()).then(res => res.json()).then(data => setBuyer(data));
  }, []);
  return buyer;
};

const Completed = ({ sell }: { sell: SellDto }) => {
  const buyer = useBuyer(sell.id);
  if (buyer == null) {
    return null;
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography>{buyer.userName}さんに購入されました。</Typography>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="120px" value={dayjs(buyer.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="120px" value={dayjs(sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="取引完了日時" labelWidth="120px" value={dayjs(sell.completedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
    </Stack>
  )
};


const ReviewBySeller = ({ sell }: { sell: SellDto }) => {
  const navigate = useNavigate();
  const buyer = useBuyer(sell.id);

  if (buyer == null) {
    return null;
  }
  return (
    <Stack alignItems="center" spacing={2}>
      <Typography>{buyer.userName}さんに購入されました。</Typography>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buyer.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="100px" value={dayjs(sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
      <ReviewForm sellId={sell.id} revieweeId={buyer.userId} reviewAsBuyer={false} callback={() => {
        navigate(0);
      }} />
    </Stack>
  );
};

const ReviewByBuyer = ({ sell }: { sell: SellDto }) => {
  const buyer = useBuyer(sell.id);
  if (buyer == null) {
    return null;
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography>{buyer.userName}さんに購入されました。</Typography>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buyer.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="100px" value={dayjs(sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
    </Stack>
  );
};

const NowSelling = ({ sell }: { sell: SellDto }) => {
  const navigate = useNavigate();
  return (
    <Stack alignItems="center">
      <Button onClick={() => {
        navigate(`/sell/update/${sell.id}`);
      }}>出品内容を更新する</Button>
    </Stack>
  );
}

const NeedShipping = ({ sell }: { sell: SellDto }) => {
  const buyer = useBuyer(sell.id);
  const api = useApi();
  const navigate = useNavigate();
  const errorDialogModel = useErrorDialogModel();
  if (buyer == null) {
    return null;
  }

  return (
    <Stack alignItems="center" spacing={1}>
      <Typography>{buyer.userName}さんに購入されました。</Typography>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buyer.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="お届け先" labelWidth="100px" value={buyer.shippingAddress} />
        <Button
          onClick={async () => {
            const res = await api.fetch(`/api/shipping/sells/${sell.id}/shipped`, {
              method: "PUT"
            });
            if (res.status == 400) {
              const body = await res.json();
              if (body.cause == "AlreadyShipped") {
                errorDialogModel.show("すでに発送済みです");
                return;
              } else {
                errorDialogModel.show("発送処理に失敗しました");
                return;
              }
            }
            navigate(0);
          }}
        >発送したので発送通知する</Button>
      </Stack>
    </Stack>
  )
}