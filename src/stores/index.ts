import React from "react";
import { action, configure, observable, runInAction } from "mobx";
import { loadCookie, fetchCodeKey } from "../utils";
import { Audic } from "../audic";
import shelljs from "shelljs";
import robot from "robotjs";
import path from "path";
import fs from "fs";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runScript(list: Array<ScriptT>) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    switch (item.type) {
      case "keydown":
        robot.keyToggle(fetchCodeKey(item.rawcode), "down");
        break;
      case "keyup":
        robot.keyToggle(fetchCodeKey(item.rawcode), "up");
        break;
      case "mouseclick":
        robot.moveMouse(item.x, item.y);
        if (item.button === 1) {
          robot.mouseClick("left");
        } else if (item.button === 2) {
          robot.mouseClick("right");
        }
        break;
      case "mousemove":
        robot.moveMouse(item.x, item.y);
        break;
    }
    item.delay && (await delay(item.delay));
  }
}

export function runNotices(value: number, list: OptionT["notices"]) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item.type) {
      continue;
    }
    if (item.target !== value) {
      continue;
    }
    if (item.type === "keyboard" && !item.key_code) {
      continue;
    }
    if (item.type !== "keyboard" && !item.file_path) {
      continue;
    }
    switch (item.type) {
      case "audio":
        shelljs.cd(path.dirname(item.file_path!));
        console.log(path.dirname(item.file_path!), path.basename(item.file_path!));
        new Audic(path.basename(item.file_path!)).play();
        break;
      case "keyboard":
        robot.keyToggle(item.key_code!.toLocaleUpperCase(), "down");
        robot.keyToggle(item.key_code!.toLocaleUpperCase(), "up");
        break;
      case "script":
        const text = fs.readFileSync(item.file_path!, "utf8");
        runScript(JSON.parse(text));
        break;
    }
  }
}

export class AppState {
  @observable
  options: Array<OptionT> = loadCookie().options;
  timer: { [key: string]: NodeJS.Timeout } = {};
  enable = false;

  @action
  updateOptions(data: Array<OptionT>) {
    if (this.enable) {
      for (let key in this.timer) {
        clearInterval(this.timer[key]);
        delete this.timer[key];
      }
      this.enable = false;
    }
    for (let i = 0; i < data.length; i++) {
      data[i].display_value = data[i].value;
    }
    this.options = data;
  }

  @action
  enableTimer() {
    for (let i = 0; i < this.options.length; i++) {
      const item = this.options[i];
      if (this.enable && item.enable) {
        clearInterval(this.timer[item.name]);
        delete this.timer[item.name];
        continue;
      }
      item.display_value = item.value;
      item.enable && this.runTimer(item.name);
    }
    this.enable = !this.enable;
  }

  @action
  runTimer(name: string) {
    const index = this.options.findIndex((e) => {
      return e.name === name;
    });
    if (index === -1) {
      return;
    }
    this.timer[name] = setInterval(() => {
      const item = this.options[index];
      runInAction(() => {
        if (!item.display_value && !item.loop) {
          clearInterval(this.timer[name]);
          delete this.timer[name];
          return;
        }
        if (item.display_value) {
          item.display_value = item.display_value - 1;
        } else {
          item.display_value = item.value - 1;
        }
        runNotices(item.display_value, item.notices);
      });
    }, 1000);
  }
}

configure({ enforceActions: "always" });

export const stores = new AppState();
export const storeContext = React.createContext(stores);
export const useStore = () => React.useContext(storeContext);
