import { ButtonRole, QMessageBox, QPushButton } from "@nodegui/nodegui";

export function nativeErrorHandler(error: string, stack?: string) {
  const message = new QMessageBox();
  const close = new QPushButton(message);
  close.setText("关闭");
  message.setText(error);
  message.setDetailedText(stack || error);
  message.addButton(close, ButtonRole.RejectRole);
  message.show();
}
