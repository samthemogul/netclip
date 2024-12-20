import type { Metadata } from "next";
import React from "react";



export const metadata: Metadata = {
  title: "Top Movies Now",
  description: "Stream your favourite movies",
};


export default function MovieSearchResultLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <>{children}</>;
};
