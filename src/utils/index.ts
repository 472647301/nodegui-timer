import fs from "fs";
import path from "path";
import { decode, encode } from "js-base64";
import { ButtonRole, QMessageBox, QPushButton } from "@nodegui/nodegui";
import { options } from "../config";
import os from "os";

export const homedir = path.resolve(os.homedir(), "Documents/ByronTimer");

const filePath = path.resolve(homedir, "../cookies.txt");

type Cookies = {
  options: Array<OptionT>;
  timer_shortcut: string;
  script_shortcut: string;
};

export function loadCookie(): Cookies {
  if (!fs.existsSync(homedir)) {
    fs.mkdirSync(homedir);
  }
  if (!fs.existsSync(filePath)) {
    return {
      options: options,
      timer_shortcut: "f5",
      script_shortcut: "f6",
    };
  }
  const text = fs.readFileSync(filePath, "utf8");
  const data = text ? decode(text) : "";
  if (!data) {
    return {
      options: options,
      timer_shortcut: "f5",
      script_shortcut: "f6",
    };
  }
  return JSON.parse(data);
}

export function saveCookie(data: Cookies) {
  const text = JSON.stringify(data);
  const content = encode(text);
  fs.writeFileSync(filePath, content);
}

export function nativeErrorHandler(error: string, stack?: string) {
  const message = new QMessageBox();
  message.setWindowTitle("Error");
  const close = new QPushButton(message);
  close.setText("关闭");
  message.setText(error);
  message.setDetailedText(stack || error);
  message.addButton(close, ButtonRole.RejectRole);
  message.show();
}

type KeyBoard = {
  [key: string]: number;
};

export const keyboard: KeyBoard = {
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  "0": 48,
  "-": 189,
  "=": 187,
  back: 8,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  ctrl: 17,
  alt: 18,
  shift: 16,
  win: 91,
  space: 32, // 空格
  cap: 20,
  tab: 9,
  "~": 192,
  esc: 27,
  enter: 13,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  option: 93,
  print: 44,
  delete: 46,
  home: 36,
  end: 35,
  pgup: 33,
  pgdn: 34,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  "[": 219,
  "]": 221,
  "\\": 220,
  ";": 186,
  "'": 222,
  ",": 188,
  ".": 190,
  "/": 191,
};

export const fetchCodeKey = (code: number) => {
  let str = "";
  Object.keys(keyboard).forEach((k) => {
    if (code === keyboard[k]) {
      str = k;
      return;
    }
  });
  return str;
};
