"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from ".";
import { EnhancedStore } from "@reduxjs/toolkit";

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<EnhancedStore<unknown>>(store);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef!.current!}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
