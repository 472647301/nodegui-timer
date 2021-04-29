import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { QMainWindow, WidgetAttribute } from "@nodegui/nodegui";
import { WindowType, QApplication } from "@nodegui/nodegui";
import { Window, View, useEventHandler } from "@nodegui/react-nodegui";
import os from "os";

const initWindow = (win: QMainWindow) => {
  win.hide();
  win.resize(300, 300);

  win.setWindowFlag(WindowType.FramelessWindowHint, true);
  win.setWindowFlag(WindowType.Widget, true);
  if (os.platform() === "darwin") {
    win.setAttribute(WidgetAttribute.WA_TranslucentBackground, true);
  }
  win.show();
};

export const App = () => {
  const winRef = useRef<QMainWindow>(null);
  useEffect(() => {
    if (winRef.current) {
      const win = winRef.current;
      initWindow(win);
    }
  }, []);

  return (
    <Window ref={winRef}>
      <View></View>
    </Window>
  );
};
