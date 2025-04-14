import { SellDetail } from "@/components/catalog/SellDetail";
import { ReviewForm } from "@/components/review/ReviewForm";
import { LabelAndValue } from "@/components/util/LabelAndValue";
import { BuyDto } from "@/dto/buy/BuyDto";
import { SellDto } from "@/dto/catalog/SellDto";
import { useApi } from "@/util/ApiProvider";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";

export const BuyDetailPage = () => {
  const { id } = useParams();
  const [buy, setBuy] = useState<BuyDto>(null);
  const [sell, setSell] = useState<SellDto>(null);
  const api = useApi();
  useEffect(() => {
    api.fetch(`/api/buy/buys/${id}`).then(res => res.json()).then((data: BuyDto) => {
      setBuy(data);
      api.fetch(`/api/catalog/sells/${data.sellId}`)
        .then(res => res.json())
        .then((data: SellDto) => setSell(data));

    });
  }, []);

  if (sell == null) {
    return null;
  }

  let statusSpecific = getStatusSpecific(buy);

  return (
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">購入した商品</Typography>
      <Box textAlign="center">
        <Chip sx={{ fontSize: "1.5em", padding: 1 }} label={statusSpecific.statusText} color="primary" />
      </Box>
      <SellDetail sell={sell} />
      {statusSpecific.tailComp}
      <Box textAlign="center">
        <Link component={RouterLink} to="/buy/list">一覧に戻る</Link>
      </Box>
    </Stack>
  );
};

function getStatusSpecific(buy: BuyDto) {
  let statusText = null;
  let tailComp = null;
  switch (buy.sell.status) {
    case "NEED_SHIPPING":
      statusText = "発送待ちです";
      tailComp = <WaitForShipping buy={buy} />
      break;
    case "NEED_REVIEW_BY_BUYER":
      statusText = "商品が到着したら出品者を評価してください";
      tailComp = <ReviewByBuyer buy={buy} />
      break;
    case "NEED_REVIEW_BY_SELLER":
      statusText = "出品者からの評価待ちです";
      tailComp = <ReviewBySeller buy={buy} />
      break;
    case "COMPLETED":
      statusText = "取引は終了しました";
      tailComp = <Completed buy={buy} />
      break;
  }

  return {
    statusText, tailComp
  }
}

const Completed = ({ buy }: { buy: BuyDto }) => {
  return (
    <Stack alignItems="center" spacing={2}>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="120px" value={dayjs(buy.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="120px" value={dayjs(buy.sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="取引終了日時" labelWidth="120px" value={dayjs(buy.sell.completedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
    </Stack>
  );
};


const ReviewBySeller = ({ buy }: { buy: BuyDto }) => {
  return (
    <Stack alignItems="center" spacing={2}>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buy.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="100px" value={dayjs(buy.sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
    </Stack>
  );
}

const ReviewByBuyer = ({ buy }: { buy: BuyDto }) => {
  const navigate = useNavigate();
  return (
    <Stack alignItems="center" spacing={2}>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buy.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
        <LabelAndValue label="発送日時" labelWidth="100px" value={dayjs(buy.sell.shippedDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>

      <ReviewForm sellId={buy.sellId} revieweeId={buy.sell.userId} reviewAsBuyer={true} callback={() => {
        navigate(0);
      }} />
    </Stack>
  )
}

const WaitForShipping = ({ buy }: { buy: BuyDto }) => {
  return (
    <Stack alignItems="center" spacing={1}>
      <Stack spacing={1}>
        <LabelAndValue label="購入日時" labelWidth="100px" value={dayjs(buy.buyDateTime).format("YYYY/MM/DD HH:mm:ss")} />
      </Stack>
    </Stack >

  );
};