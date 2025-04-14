import { SellDto } from "@/dto/sell/SellDto";
import { ProductImageEditModel } from "@/model/sell/ProductImageEditModel";
import { ValidatableForm } from "@/model/util/ValidatableForm";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

export const SellForm = observer(({ sellDto, action, actionLabel, cancel, productImageEditModel }: { sellDto: SellDto, action: (form: ValidatableForm) => Promise<void>, actionLabel: string, cancel: () => void, productImageEditModel: ProductImageEditModel }) => {

  const [form] = useState(new ValidatableForm());

  useEffect(() => {
    if (sellDto != null) {
      form.preset("productName", sellDto.productName);
      form.preset("description", sellDto.description);
      form.preset("price", sellDto.price);
      const productImageIds = sellDto.productImages.map(image => image.id)
      productImageEditModel.load(productImageIds, sellDto.id);
    }
  }, []);

  form.setValidation("productName", (val) => {
    if (val == null || val.length == 0) {
      return "商品名を入力してください";
    } else if (val.length > 30) {
      return "商品名は30文字以内で入力してください";
    } else {
      return true;
    }
  });
  form.setValidation("description", (val) => {
    if (val == null || val.length == 0) {
      return "説明を入力してください";
    } else if (val.length > 100) {
      return "説明は100文字以内で入力してください";
    } else {
      return true;
    }
  });
  form.setValidation("price", (val) => {
    if (val == null || val.length == 0) {
      return "値段を入力してください";
    }
    const num = Number(val);
    if (num < 100 || num > 100000) {
      return "値段は100円以上、10万円以下を入力してください"
    }
    return true;
  });
  form.setValidation("images", (val) => {
    //valはnullとなる。ここでModelをチェック
    if (productImageEditModel.getImages().length > 0) {
      return true;
    } else {
      return "画像を1つ以上入力してください";
    }
  });

  return (
    <>
      <Stack spacing={1} alignItems="center">
        <Typography>商品画像</Typography>
        <Typography color="error">{form.getError("images")}</Typography>
        <Box>
          <ImageList sx={{ width: "500px", margin: 0 }} cols={3}>
            {productImageEditModel.getImages().map((image, idx) => {
              return (
                <ImageListItem key={idx} onClick={() => {

                }}>
                  <img
                    src={URL.createObjectURL(image.data)}
                  />
                  <ImageListItemBar
                    position="top"
                    sx={{
                      backgroundColor: "transparent"
                    }}
                    //title={"foo"}
                    actionIcon={
                      <IconButton sx={{ color: "red" }}
                        onClick={() => {
                          productImageEditModel.deleteImage(image.data);
                          // Validationを走らせるため便宜的にtouchする
                          form.touch("images", null);
                        }}
                      >
                        <HighlightOffOutlinedIcon />
                      </IconButton>
                    }
                  />

                </ImageListItem>
              )
            })}
          </ImageList>
        </Box>
      </Stack>
      <Box display="flex" justifyContent="center">
        <Button
          component="label"
        >
          ファイルを追加
          <input
            type="file"
            hidden
            data-testid="file-input"
            onChange={(event) => {
              productImageEditModel.addImage(event.target.files[0]);
              // Validationを走らせるため便宜的にtouchする
              form.touch("images", null);
            }}
          />
        </Button>
      </Box>

      <Stack spacing={1} width="500px">
        <TextField label="商品名" value={form.getValue("productName")} onChange={(event) => {
          form.touch("productName", event.target.value);
        }}
          error={form.hasError("productName")}
          helperText={form.getError("productName")}
        />
        <TextField label="説明" value={form.getValue("description")}
          onChange={(event) => {
            form.touch("description", event.target.value);
          }}
          multiline rows={5}
          error={form.hasError("description")}
          helperText={form.getError("description")}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField label="値段" type="number" value={form.getValue("price")} onChange={(event) => {
            form.touch("price", event.target.value);
          }}
            error={form.hasError("price")}
            helperText={form.getError("price")}

          />
          <Typography>円</Typography>
        </Stack>
        <Box display="flex" justifyContent="center">

          <Button
            disabled={!(form.isAnyTouched() && form.isAllValid())}
            onClick={async () => {
              await action(form);
            }}
          >{actionLabel}</Button>
          <Button
            onClick={cancel}
          >キャンセル</Button>
        </Box>
      </Stack>
    </>
  );
});