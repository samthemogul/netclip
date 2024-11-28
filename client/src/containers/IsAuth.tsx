"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function isAuth(Component: any) {
  
  return function IsAuth(props: any) {
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
      if (!user.id || !user.accessToken) {
        return redirect("/");
      }
    }, []);

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}
