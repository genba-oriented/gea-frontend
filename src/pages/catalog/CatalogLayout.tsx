import { SearchModel } from "@/model/catalog/SearchModel";
import { useApi } from "@/util/ApiProvider";
import { useState } from "react";
import { Outlet } from "react-router";

export const CatalogLayout = () => {
  const api = useApi();
  const [searchModel] = useState(new SearchModel(api));
  return (
    <Outlet context={searchModel} />
  )
};