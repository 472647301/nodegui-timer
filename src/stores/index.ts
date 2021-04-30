import React from "react";
import { action, configure, observable, runInAction } from "mobx";
import { options } from "../config";

export class AppState {
  @observable
  options: Array<OptionT> = options;
  timer: { [key: string]: NodeJS.Timeout } = {};
  enable = false;

  @action
  updateOptions(data: Array<OptionT>) {
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
