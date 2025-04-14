import { useErrorDialogModel } from "@/model/util/ErrorDialogModelProvider";
import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";

export const ErrorDialog = observer(() => {
  const errorModel = useErrorDialogModel();
  return (
    <Dialog open={errorModel.isOpen} onClose={() => {
      errorModel.hide();
    }}>
      <DialogTitle>エラー</DialogTitle>
      <Stack padding={1} spacing={1} alignItems="center">
        <Typography>{errorModel.message}</Typography>
        <Button onClick={() => {
          errorModel.hide();
        }}>閉じる</Button>
      </Stack>
    </Dialog>
  );
});