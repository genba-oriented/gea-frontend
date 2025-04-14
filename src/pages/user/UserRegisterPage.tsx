import { LabelAndValue } from "@/components/util/LabelAndValue";
import { useLoginUserModel } from "@/model/user/LoginUserModelProvider";
import { ValidatableForm } from "@/model/util/ValidatableForm";
import { useApi } from "@/util/ApiProvider";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const UserRegisterPage = observer(() => {
  const api = useApi();
  const loginUserModel = useLoginUserModel();
  const navigate = useNavigate();
  const [form] = useState(new ValidatableForm());

  useEffect(() => {
    if (loginUserModel.activated) {
      navigate("/mypage", { replace: true });
    }
  });

  form.setValidation("name", (val: string) => {
    if (val == null || val.length == 0 || val.length > 50) {
      return "お名前は1文字以上50文字以下を入力してください";
    }
    return true;
  })
  form.setValidation("shippingAddress", (val: string) => {
    if (val == null || val.length == 0 || val.length > 100) {
      return "配送先は1文字以上100文字以下を入力してください";
    }
    return true;
  })
  form.setValidation("deposit", (val: number) => {
    if (val == null || val < 100 || val > 100000) {
      return "入金額は100円以上、10万円以下を入力してください"
    }
    return true;
  })

  return (
    <Stack alignItems="center" spacing={1}>
      <Typography variant="h5">ユーザ登録</Typography>
      <LabelAndValue label="登録するメールアドレス" labelWidth="200px" value={loginUserModel.email} />
      <Stack spacing={1} width="500px">
        <TextField label="お名前" value={form.getValue("name")} onChange={(event) => {
          form.touch("name", event.target.value);
        }}
          error={form.hasError("name")}
          helperText={form.getError("name")}
        />

        <TextField label="配送先" value={form.getValue("shippingAddress")} onChange={(event) => {
          form.touch("shippingAddress", event.target.value);
        }}
          error={form.hasError("shippingAddress")}
          helperText={form.getError("shippingAddress")}
        />

        <TextField label="入金額" type="number" value={form.getValue("deposit")} onChange={(event) => {
          form.touch("deposit", event.target.value);
        }}
          error={form.hasError("deposit")}
          helperText={form.getError("deposit")}
        />

      </Stack>
      <Stack direction="row">
        <Button
          disabled={!form.isAllValid()}
          onClick={async () => {
            const body = form.getValuesAsObject();
            await api.fetch(`/api/user/users/${loginUserModel.id}/activate`, {
              method: "PUT",
              body: JSON.stringify(body)
            });
            // リロードする
            location.href = "/mypage";
          }}
        >登録する</Button>
        <Button onClick={() => {
          navigate("/");
        }}>キャンセル</Button>
      </Stack>
    </Stack>
  );

});