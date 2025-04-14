import { BrowserRouter, Route, Routes } from "react-router";
import { NotFoundPage } from "./NotFoundPage";
import { RootLayout } from "./RootLayout";
import { LoginPage } from "./authn/LoginPage";
import { NeedLoginLayout } from "./authn/NeedLoginLayout";
import { BuyDetailPage } from "./buy/BuyDetailPage";
import { BuyListPage } from "./buy/BuyListPage";
import { BuyingPage } from "./buy/BuyingPage";
import { CatalogDetailPage } from "./catalog/CatalogDetailPage";
import { CatalogLayout } from "./catalog/CatalogLayout";
import { CatalogListPage } from "./catalog/CatalogListPage";
import { SellDetailPage } from "./sell/SellDetailPage";
import { SellListPage } from "./sell/SellListPage";
import { SellUpdatePage } from "./sell/SellUpdatePage";
import { SellingPage } from "./sell/SellingPage";
import { MyPage } from "./user/MyPage";
import { UserRegisterPage } from "./user/UserRegisterPage";


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<CatalogLayout />}>
            <Route index element={<CatalogListPage />} />
            <Route path="/catalog/list" element={<CatalogListPage />} />
            <Route path="/catalog/detail/:id" element={<CatalogDetailPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<NeedLoginLayout />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/sell/selling" element={<SellingPage />} />
            <Route path="/sell/update/:id" element={<SellUpdatePage />} />
            <Route path="/sell/list" element={<SellListPage />} />
            <Route path="/sell/detail/:id" element={<SellDetailPage />} />
            <Route path="/buy/buying/:sellId" element={<BuyingPage />} />
            <Route path="/buy/list" element={<BuyListPage />} />
            <Route path="/buy/detail/:id" element={<BuyDetailPage />} />
          </Route>
          <Route path="/user/register" element={<UserRegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter >

  );
}


