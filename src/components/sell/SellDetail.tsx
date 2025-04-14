import { SellDto } from "@/dto/sell/SellDto";
import { currency } from "@/util/formatter";
import { Box, ImageList, ImageListItem, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { LabelAndValue } from "../util/LabelAndValue";

export const SellDetail = ({ sellDto }: { sellDto: SellDto }) => {
  const [bigImageId, setBigImageId] = useState(null);
  useEffect(() => {
    setBigImageId(sellDto.productImages[0].id);
  }, []);
  if (bigImageId == null) {
    return null;
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Box>
        <img src={`/api/sell/sells/${sellDto.id}/product-images/${bigImageId}`} style={{ width: "500px", height: "auto" }} />
      </Box>
      <Box>
        <ImageList sx={{ width: "500px", margin: 0 }} cols={5}>
          {sellDto.productImages.map((productImage, idx) => (
            <ImageListItem key={productImage.id} sx={{ cursor: "pointer" }} onClick={() => {
              setBigImageId(productImage.id);
            }}>
              <img
                src={`/api/sell/sells/${sellDto.id}/product-images/${productImage.id}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box>
        <Stack spacing={1}>
          <LabelAndValue label="商品名" labelWidth="100px" value={sellDto.productName} />
          <LabelAndValue label="値段" labelWidth="100px" value={currency(sellDto.price)} />
          <LabelAndValue label="説明" labelWidth="100px" value={sellDto.description} />
          <LabelAndValue label="出品日時" labelWidth="100px" value={dayjs(sellDto.sellDateTime).format("YYYY/MM/DD hh:mm:ss")} />
        </Stack>
      </Box>
    </Stack>

  );
};

