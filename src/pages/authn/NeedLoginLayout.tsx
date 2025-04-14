import { useLoginUserModel } from "@/model/user/LoginUserModelProvider";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export const NeedLoginLayout = observer(() => {
  const loginUserModel = useLoginUserModel();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loginUserModel.logined) {
      const param = new URLSearchParams({
        afterAuth: location.pathname
      }).toString();
      navigate("/login?" + param, { replace: true });
    } else if (!loginUserModel.activated) {
      navigate("/user/register", { replace: true });
    }
  }, []);
  if (!loginUserModel.logined) {
    return null;
  }
  return (
    <Outlet />
  )
});