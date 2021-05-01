import ioHook from "iohook";
import { QInputDialog } from "@nodegui/nodegui";
import { keyboard } from "../utils";
import { stores } from "../stores";
import path from "path";
import fs from "fs";

class CreateScript {
  private enable = true;
  private savename = "";
  private delaytime = 0;
  private list: Array<ScriptT> = [];
  private shortcut = 117;

  public init(code: number) {
    this.shortcut = code;
    if (!this.enable) {
      this.enable = true;
      ioHook.removeAllListeners();
      this.saveScript();
      return;
    }
    this.list = [];
    this.savename = "";
    this.enable = false;
    ioHook.on("keyup", this.keyCodeEvent.bind(this));
    ioHook.on("keydown", this.keyCodeEvent.bind(this));
    ioHook.on("mouseclick", this.mouseEvent.bind(this));
  }

  private keyCodeEvent(event: KeyCodeEvt) {
    if (!this.list.length && event.rawcode === this.shortcut) {
      return;
    }
    const now = Date.now();
    let delay = 0;
    if (this.delaytime) {
      delay = now - this.delaytime;
    }
    this.delaytime = now;
    const item: ScriptT = {
      x: 0,
      y: 0,
      type: event.type,
      button: 0,
      rawcode: event.rawcode,
      delay: delay,
    };
    this.list.push(item);
  }

  private mouseEvent(event: MouseEvt) {
    const now = Date.now();
    let delay = 0;
    if (this.delaytime) {
      delay = now - this.delaytime;
    }
    this.delaytime = now;
    const item: ScriptT = {
      x: event.x,
      y: event.y,
      type: event.type,
      button: event.button,
      rawcode: 0,
      delay: delay,
    };
    this.list.push(item);
  }

  private saveScript() {
    const dialog = new QInputDialog();
    dialog.setWindowTitle("保存脚本");
    dialog.setLabelText("请输入保存名称");
    dialog.addEventListener("textValueChanged", (text) => {
      this.savename = text;
    });
    dialog.addEventListener("accepted", () => {
      if (!this.savename) {
        return;
      }
      const dir = path.resolve(__dirname, `../scripts`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      this.list.splice(this.list.length - 1, 1);
      fs.writeFile(
        `${dir}/${this.savename}.json`,
        JSON.stringify(this.list),
        (err) => {
          console.log(err);
        }
      );
    });
    dialog.exec();
  }
}

const scriptEvent = new CreateScript();

export const iohookScript = {
  init: function () {
    ioHook.useRawcode(true);
    ioHook.start();
  },
  unregister: function () {
    ioHook.unregisterAllShortcuts();
  },
  registerTimer: function (key: string) {
    const code = keyboard[key];
    ioHook.registerShortcut([code], () => {
      stores.enableTimer();
    });
  },
  registerScript: function (key: string) {
    const code = keyboard[key];
    ioHook.registerShortcut([code], () => {
      scriptEvent.init(code);
    });
  },
};
