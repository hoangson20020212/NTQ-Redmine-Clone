import { Fragment, ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AuthProtect = ({ children }: { children: ReactNode }) => {
  // const isLogin = localStorage.getItem("accessToken");
  const isLogin = true;

  return <Fragment>{isLogin ? children : <Navigate to="/login" />}</Fragment>;
};

export default AuthProtect;
