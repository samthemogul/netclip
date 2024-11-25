import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "NetClip",
  description: "Stream your favourite movies",
};


export default function MovieDetailLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <>{children}</>;
};
