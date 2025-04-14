import { SellForm } from "@/components/sell/SellForm";
import { SellDto } from "@/dto/sell/SellDto";
import { ProductImageEditModel } from "@/model/sell/ProductImageEditModel";
import { ValidatableForm } from "@/model/util/ValidatableForm";
import { useApi } from "@/util/ApiProvider";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const SellUpdatePage = () => {
  const api = useApi();
  const [productImageEditModel] = useState(new ProductImageEditModel(api));
  return <SellUpdatePageWrapped productImageEditModel={productImageEditModel} />;
};

// テスト時に、モック化したModelをpropsで渡せるようにしたいので、ラップしている
// テスト時はこのコンポーネントをテストする
export const SellUpdatePageWrapped = ({ productImageEditModel }) => {
  const { id } = useParams();
  const api = useApi();


  const navigate = useNavigate();
  const [sell, setSell] = useState(null);

  useEffect(() => {
    api.fetch(`/api/sell/sells/${id}`).then(res => res.json()).then((sellDto: SellDto) => setSell(sellDto));
  }, []);

  const doUpdate = async (form: ValidatableForm) => {
    const body = form.getValuesAsObject();
    await api.fetch(`/api/sell/sells/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });
    if (productImageEditModel.isNeedSync()) {
      await productImageEditModel.doSync(id);
    }


    navigate(`/sell/detail/${id}`);
  }

  const cancel = () => {
    navigate(`/sell/detail/${id}`);
  }

  if (sell == null) {
    return null;
  }

  return (
    <Stack alignItems="center" spacing={1}>
      <Typography variant="h5" textAlign="center">出品内容を更新</Typography>
      <SellForm sellDto={sell} actionLabel="更新する" action={doUpdate} cancel={cancel} productImageEditModel={productImageEditModel} />
    </Stack>
  );
};
