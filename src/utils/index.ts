import fs from "fs";
import path from "path";
import { decode, encode } from "js-base64";
import { ButtonRole, QMessageBox, QPushButton } from "@nodegui/nodegui";
import { options } from "../config";

const filePath = path.resolve(__dirname, "../cookies.txt");

export function loadCookie(): Array<OptionT> {
  if (!fs.existsSync(filePath)) {
    return options;
  }
  const text = fs.readFileSync(filePath, "utf8");
  const data = text ? decode(text) : "";
  if (!data) {
    return options;
  }
  return JSON.parse(data);
}

export function saveCookie(data: Array<OptionT>) {
  const text = JSON.stringify(data);
  const content = encode(text);
  fs.writeFileSync(filePath, content);
}

export function nativeErrorHandler(error: string, stack?: string) {
  const message = new QMessageBox();
  const close = new QPushButton(message);
  close.setText("关闭");
  message.setText(error);
  message.setDetailedText(stack || error);
  message.addButton(close, ButtonRole.RejectRole);
  message.show();
}
