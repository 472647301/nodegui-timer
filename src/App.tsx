import React, { useEffect } from "react";
import { FunctionComponent, useRef, useState } from "react";
import { Window, View, Button, Dialog } from "@nodegui/react-nodegui";
import { QMainWindow, WidgetAttribute } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";
import { WindowType, QMouseEvent, QIcon, QSize } from "@nodegui/nodegui";
import { stores, storeContext, useStore } from "./stores";
import { SettingView } from "./views/Setting";
import { HomeView } from "./views/Home";
import setting from "./icons/setting.svg";
import { iohookScript } from "./iohook";
import { observer } from "mobx-react";
import { loadCookie } from "./utils";
import { styles } from "./styles";
import { size } from "./config";

const cookies = loadCookie();

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
  const [visible, setVisible] = useState(false);

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

  const onUpdate = (data: Array<OptionT>) => {
    store.updateOptions(data);
    setVisible(false);
  };

  useEffect(() => {
    iohookScript.registerTimer(cookies.timer_shortcut);
    iohookScript.registerScript(cookies.script_shortcut);
    iohookScript.init();
  }, []);

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
        <HomeView />
        <Button
          icon={new QIcon(setting)}
          iconSize={new QSize(25, 25)}
          on={{ clicked: () => setVisible(true) }}
          style={styles.button}
        />
        <Dialog
          open={visible}
          windowTitle={"Setting"}
          minSize={{ width: 420, height: 480 }}
          on={{ Close: () => setVisible(false) }}
        >
          <SettingView options={store.options} onUpdate={onUpdate} />
        </Dialog>
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
