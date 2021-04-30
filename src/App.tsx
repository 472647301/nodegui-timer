import React, { FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import { QMainWindow, WidgetAttribute } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";
import { Window, View, Text, Button } from "@nodegui/react-nodegui";
import { WindowType, QMouseEvent, QIcon, QSize } from "@nodegui/nodegui";
import { stores, storeContext, useStore } from "./stores";
import setting from "./icons/setting.svg";
import { observer } from "mobx-react";
import { styles } from "./styles";
import { size } from "./config";

const windowFlags = {
  [WindowType.Widget]: true,
  [WindowType.FramelessWindowHint]: true,
};

const attributes = {
  [WidgetAttribute.WA_TranslucentBackground]: true,
};

const App: FunctionComponent = observer(() => {
  const store = useStore();
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

  const onHandle = {
    MouseMove: handleMouseEvent,
    MouseButtonPress: handleMouseEvent,
  };

  const onClickedSetting = () => {
    console.log("onClickedSetting");
    store.enableTimer();
  };

  // useEffect(() => {
  //   store.enableTimer();
  // }, []);

  return (
    <Window
      size={size}
      ref={winRef}
      style={styles.win}
      attributes={attributes}
      windowFlags={windowFlags}
      on={onHandle}
    >
      <View style={styles.view}>
        {store.options.map((e, i) => {
          return (
            <React.Fragment key={e.name}>
              <Text style={styles.text}>{e.display_name || "--"}:</Text>
              <Text style={styles.value}>{e.display_value || "--"}</Text>
            </React.Fragment>
          );
        })}
        <Button
          icon={new QIcon(setting)}
          iconSize={new QSize(25, 25)}
          on={{ clicked: onClickedSetting }}
          style={styles.button}
        />
      </View>
    </Window>
  );
});

const Wrapped: FunctionComponent = () => {
  return (
    <storeContext.Provider value={stores}>
      <App />
    </storeContext.Provider>
  );
};

export default Wrapped;
