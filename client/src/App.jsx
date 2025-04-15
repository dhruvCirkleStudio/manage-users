import { useState } from "react";
import "./App.css";
import Router from "./routes/Router";
import ToastNotification from "./utils/ToastNotification";

function App() {
  return (
    <>
      <Router />
      <ToastNotification/>
    </>
  );
}

export default App;
