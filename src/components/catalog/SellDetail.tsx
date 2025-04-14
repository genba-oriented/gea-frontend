import { SellDto } from "@/dto/catalog/SellDto";
import { useApi } from "@/util/ApiProvider";
import { currency } from "@/util/formatter";
import { Box, ImageList, ImageListItem, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RatedUser } from "../review/RatedUser";
import { AbsolutePositionSoldBadge } from "../sell/AbsolutePositionSoldBadge";
import { LabelAndValue } from "../util/LabelAndValue";

export const SellDetail = ({ sell }: { sell: SellDto }) => {
  const [bigImageId, setBigImageId] = useState(null);
  const [ratedUser, setRatedUser] = useState(null);
  const api = useApi();
  useEffect(() => {
    setBigImageId(sell.productImageIds[0]);
    api.fetch(`/api/review/rated-users/${sell.userId}`).then(res => res.json()).then(data => setRatedUser(data));
  }, []);
  if (bigImageId == null || ratedUser == null) {
    return null;
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Box position="relative">
        <img src={`/api/catalog/sells/${sell.id}/product-images/${bigImageId}`} style={{ width: "500px", height: "auto", filter: sell.sold ? "grayscale(100%)" : "none" }} />
        {sell.sold && <AbsolutePositionSoldBadge width="100px" height="50px" />}
      </Box>
      <Box>
        <ImageList sx={{ width: "500px", margin: 0 }} cols={5}>
          {sell.productImageIds.map((id) => (
            <ImageListItem key={id} sx={{ cursor: "pointer" }} onClick={() => {
              setBigImageId(id);
            }}>
              <img
                src={`/api/catalog/sells/${sell.id}/product-images/${id}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box>
        <Stack spacing={1} textAlign="center">
          <Typography variant="h5">{sell.productName}</Typography>
          <Typography>{currency(sell.price)}</Typography>
          <Typography>{sell.description}</Typography>
          <LabelAndValue label="出品日" labelWidth="100px" value={dayjs(sell.sellDateTime).format("YYYY/MM/DD")} />
          <LabelAndValue label="出品者" labelWidth="100px" value={<RatedUser ratedUserDto={ratedUser} />} />
        </Stack>
      </Box>
    </Stack>
  );
};

