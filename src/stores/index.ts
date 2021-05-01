import React from "react";
import { action, configure, observable, runInAction } from "mobx";
import { loadCookie, fetchCodeKey } from "../utils";
import robot from "robotjs";

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
      });
    }, 1000);
  }
}

configure({ enforceActions: "always" });

export const stores = new AppState();
export const storeContext = React.createContext(stores);
export const useStore = () => React.useContext(storeContext);
