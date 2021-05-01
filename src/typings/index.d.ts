declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.otf";

interface KeyCodeEvt {
  keycode: number;
  rawcode: number;
  type: "keydown" | "keyup";
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

interface OptionT {
  name: string;
  display_name: string;
  enable: boolean;
  value: number;
  display_value: number;
  display_name_color?: string;
  value_color?: string;
  notices: Array<Partial<NoticeT>>;
  loop?: boolean;
}

interface NoticeT {
  target: number;
  type: "audio" | "keyboard" | "script";
  key_code: string;
  file_path: string;
}

interface MouseEvt {
  button: number;
  clicks: number;
  x: number;
  y: number;
  type: "mouseclick" | "mousedown" | "mouseup" | "mousemove" | "mousedrag";
}

interface Mousewheel {
  amount: number;
  clicks: number;
  direction: number;
  rotation: number;
  type: "mousewheel";
  x: number;
  y: number;
}

interface ScriptT {
  x: number;
  y: number;
  rawcode: number;
  type: KeyCodeEvt["type"] | MouseEvt["type"] | "mousewheel";
  delay: number;
  /**
   * 1 - 鼠标左键
   * 2 - 鼠标右键
   */
  button: number;
}
