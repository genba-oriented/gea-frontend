import { LabelAndValue } from "@/components/util/LabelAndValue";
import { BuyDto } from "@/dto/buy/BuyDto";
import { useApi } from "@/util/ApiProvider";
import { currency } from "@/util/formatter";
import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const BuyListPage = () => {
  const api = useApi();
  const [buys, setBuys] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.fetch("/api/buy/buys").then(res => res.json()).then(data => setBuys(data));
  }, []);

  if (buys == null) {
    return null;
  }

  const status = (status: string) => {
    const t = (text) => <Typography>{text}</Typography>;
    switch (status) {
      case "NEED_SHIPPING":
        return "発送待ちです";
      case "NEED_REVIEW_BY_BUYER":
        return <Button>商品到着後、評価してください</Button>;
      case "NEED_REVIEW_BY_SELLER":
        return t("出品者からの評価待ちです");
      case "COMPLETED":
        return t("取引は終了しました");
    }
    return t("不明");
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" textAlign="center">購入した商品の一覧</Typography>
      {buys.length == 0 ? <NoBuys /> :
        <Stack spacing={2}>
          {buys.map((buy: BuyDto, idx) =>
            <Grid2 container key={idx} alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/buy/detail/${buy.id}`);
              }}
            >
              <Grid2 size={4}>
                <Box sx={{ width: "200px", height: "200px", overflow: "hidden", borderRadius: 2, justifySelf: "center" }}
                >
                  <img src={`/api/catalog/sells/${buy.sell.id}/product-images/${buy.sell.productImages[0].id}`} style={{ width: "400px", height: "300px", margin: "-75px 0 0 -100px" }} />

                </Box>
              </Grid2>
              <Grid2 size={4}>
                <Box justifySelf="center">
                  <Stack spacing={1}>
                    <LabelAndValue label="購入日" labelWidth="100px" value={dayjs(buy.buyDateTime).format("YYYY/MM/DD")} />
                    <LabelAndValue label="商品名" labelWidth="100px" value={buy.sell.productName} />
                    <LabelAndValue label="値段" labelWidth="100px" value={currency(buy.sell.price)} />
                  </Stack>
                </Box>
              </Grid2>
              <Grid2 size={4} textAlign="center">
                {status(buy.sell.status)}
              </Grid2>
            </Grid2>
          )}
        </Stack>
      }
    </Stack >
  );

};

const NoBuys = () => {
  return (
    <Box textAlign="center">
      <Typography>購入した商品はありません</Typography>
    </Box>
  );
};