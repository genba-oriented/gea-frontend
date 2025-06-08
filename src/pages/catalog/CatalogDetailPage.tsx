import { SellDetail } from "@/components/catalog/SellDetail";
import { BuyDto } from "@/dto/buy/BuyDto";
import { SellDto } from "@/dto/catalog/SellDto";
import { useLoginUserModel } from "@/model/user/LoginUserModelProvider";
import { useApi } from "@/util/ApiProvider";
import { Box, Button, Stack } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const CatalogDetailPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useApi();
  const [sell, setSell] = useState<SellDto>(null);
  const loginUserModel = useLoginUserModel();

  useEffect(() => {
    api.fetch(`/api/catalog/sells/${id}`)
      .then(res => res.json())
      .then((data: SellDto) => {
        if (!loginUserModel.logined) {
          setSell(data);
        } else if (data.userId == loginUserModel.id) {
          // 自分が出品した商品
          navigate(`/sell/detail/${id}`, { replace: true });
        } else if (data.sold) {
          api.fetch(`/api/buy/buys?` + new URLSearchParams({
            sellId: id
          }).toString()).then(res => res.json()).then((buys: Array<BuyDto>) => {
            if (buys.length > 0) {
              // 自分が購入した商品
              navigate(`/buy/detail/${buys[0].id}`, { replace: true })
            } else {
              setSell(data);
            }
          });
        } else {
          setSell(data);
        }
      });
  }, []);

  if (sell == null) {
    return null;
  }

  return (
    <Stack>
      <SellDetail sell={sell} />

      <Box textAlign="center">
        {!sell.sold &&
          <Button
            onClick={() => {
              navigate(`/buy/buying/${id}`);
            }}
          >購入の手続きをする</Button>
        }
      </Box>
      <Box textAlign="center">
        <Button
          onClick={() => {
            navigate("/catalog/list");
          }}
        >一覧にもどる</Button>
      </Box>
    </Stack>
  );
});

