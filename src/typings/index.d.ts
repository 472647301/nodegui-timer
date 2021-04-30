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
