import { RatedUserDto } from "@/dto/review/RatedUserDto";
import { ValidatableForm } from "@/model/util/ValidatableForm";
import { useApi } from "@/util/ApiProvider";
import { Button, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

export const ReviewForm = observer(({ sellId, revieweeId, reviewAsBuyer, callback }: { sellId: string, revieweeId: string, reviewAsBuyer: boolean, callback: () => void }) => {
  const api = useApi();
  const [ratedUser, setRatedUser] = useState<RatedUserDto>(null);
  const [form] = useState(() => {
    const form = new ValidatableForm();
    form.preset("sellId", sellId);
    form.preset("asBuyer", reviewAsBuyer);
    form.preset("result", "GOOD");
    return form;
  });
  form.setValidation("result", (val) => {
    if (val == null) {
      return "評価は必須です";
    }
    return true;
  });

  useEffect(() => {
    api.fetch(`/api/review/rated-users/${revieweeId}`).then(res => res.json()).then(data => setRatedUser(data));
  }, []);
  if (ratedUser == null) {
    return null;
  }

  return (
    <Stack alignItems="center" spacing={1}>
      <Typography>{ratedUser.userName}さんを評価してください</Typography>
      <RadioGroup
        defaultValue={form.getValue("result")}
        row
        onChange={(event) => {
          form.touch("result", event.target.value);
        }}
      >
        <FormControlLabel value="GOOD" control={<Radio />} label="よかった" />
        <FormControlLabel value="BAD" control={<Radio />} label="わるかった" />
      </RadioGroup>
      <TextField label="コメント" multiline rows={3} sx={{ width: "350px" }}
        onChange={(event) => {
          form.touch("comment", event.target.value);
        }}
      />
      <Button
        disabled={!form.isAllValid()}
        onClick={() => {
          api.fetch("/api/review/reviews", {
            method: "POST",
            body: JSON.stringify(form.getValuesAsObject())
          }).then(() => {
            callback();
          });
        }}
      >評価する</Button>
    </Stack>
  );
});