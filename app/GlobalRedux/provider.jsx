"use client";
import { Provider } from "react-redux";
import { store } from "@/app/GlobalRedux/store";
import { persistor } from "@/app/GlobalRedux/store";
import { Toaster } from "@/components/ui/toaster";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/Navbar";

export default function App({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavBar />
          {children}
          <Toaster />
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
