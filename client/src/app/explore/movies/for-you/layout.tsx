import type { Metadata } from "next";
import React from "react";



export const metadata: Metadata = {
  title: "Movies You Might Like",
  description: "Stream your favourite movies",
};


export default function MovieSearchResultLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <>{children}</>;
};
