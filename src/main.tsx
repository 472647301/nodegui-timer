import React from "react";
import { Renderer } from "@nodegui/react-nodegui";
import { nativeErrorHandler } from "./utils";
import App from "./App";

process.title = "Timer";
process.on("uncaughtException", (error) =>
  nativeErrorHandler(error.message, error.stack || "")
);
process.on("unhandledRejection", (reason) => {
  if (reason instanceof Error) {
    nativeErrorHandler(reason.message, reason.stack || "");
  } else {
    nativeErrorHandler("Unhandled promise rejection", JSON.stringify(reason));
  }
});

Renderer.render(<App />);
