import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Watchlist",
  description: "Stream your favourite movies",
};


export default function ExploreLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <>{children}</>;
};
