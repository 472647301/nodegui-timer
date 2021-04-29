import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { QMainWindow, WidgetAttribute } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";
import { Window, View, Text } from "@nodegui/react-nodegui";
import { WindowType, QMouseEvent } from "@nodegui/nodegui";
import * as styles from "./styles";

const windowFlags = {
  [WindowType.Widget]: true,
  [WindowType.FramelessWindowHint]: true,
};

const attributes = {
  [WidgetAttribute.WA_TranslucentBackground]: true,
};

export const App = () => {
  const winRef = useRef<QMainWindow>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEvent = (e?: NativeRawPointer<"QEvent">) => {
    if (!e || !winRef.current) {
      return;
    }
    const event = new QMouseEvent(e);
    const button = event.button();
    if (button) {
      // left click
      setPosition({ x: event.x(), y: event.y() });
    } else {
      // drag
      winRef.current.move(
        event.globalX() - position.x,
        event.globalY() - position.y
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <Window
      ref={winRef}
      size={styles.size}
      attributes={attributes}
      windowFlags={windowFlags}
      on={{ MouseMove: handleMouseEvent, MouseButtonPress: handleMouseEvent }}
      style={styles.win}
    >
      <View style={styles.view}>
        <Text style={styles.text}>启动程序</Text>
      </View>
    </Window>
  );
};
