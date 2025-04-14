import { LabelAndValue } from "@/components/util/LabelAndValue";
import { SellDto } from "@/dto/sell/SellDto";
import { useApi } from "@/util/ApiProvider";
import { currency } from "@/util/formatter";
import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const SellListPage = () => {

  const api = useApi();
  const [sells, setSells] = useState<Array<SellDto>>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.fetch("/api/sell/sells").then(res => res.json()).then(data => setSells(data));
  }, []);

  if (sells == null) {
    return null;
  }

  const status = (status: string) => {
    const t = (text) => <Typography>{text}</Typography>;
    switch (status) {
      case "NOW_SELLING":
        return t("出品中");
      case "NEED_SHIPPING":
        return <Button>発送してください</Button>;
      case "NEED_REVIEW_BY_BUYER":
        return t("購入者の評価待ちです");
      case "NEED_REVIEW_BY_SELLER":
        return t("購入者を評価してください");
      case "COMPLETED":
        return t("取引は終了しました");
    }
    return t("不明");
  }



  return (
    <Stack spacing={2}>
      <Typography variant="h5" textAlign="center">出品した商品の一覧</Typography>
      {sells.length == 0 ? <NoSells /> :
        <Stack spacing={2}>
          {sells.map((sell, idx) =>
            <Grid2 container key={idx} alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/sell/detail/${sell.id}`);
              }}
            >
              <Grid2 size={4}>
                <Box sx={{ width: "200px", height: "200px", overflow: "hidden", borderRadius: 2, justifySelf: "center" }}
                >
                  <img src={`/api/sell/sells/${sell.id}/product-images/${sell.productImages[0].id}`} style={{ width: "400px", height: "300px", margin: "-75px 0 0 -100px" }} />

                </Box>
              </Grid2>
              <Grid2 size={4}>
                <Box justifySelf="center">
                  <Stack spacing={1}>
                    <LabelAndValue label="出品日" labelWidth="100px" value={dayjs(sell.sellDateTime).format("YYYY/MM/DD")} />
                    <LabelAndValue label="商品名" labelWidth="100px" value={sell.productName} />
                    <LabelAndValue label="値段" labelWidth="100px" value={currency(sell.price)} />
                  </Stack>
                </Box>
              </Grid2>
              <Grid2 size={4} textAlign="center">
                {status(sell.status)}
              </Grid2>
            </Grid2>
          )}
        </Stack>
      }
    </Stack >
  );

};


const NoSells = () => {
  return (
    <Box textAlign="center">
      <Typography>出品した商品はありません</Typography>
    </Box>
  );
};