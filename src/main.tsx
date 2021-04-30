import React from "react";
import { Renderer } from "@nodegui/react-nodegui";
import App from "./App";

process.title = "Timer";
Renderer.render(<App />);
