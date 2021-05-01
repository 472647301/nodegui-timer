import React from "react";
import { ScrollArea, LineEdit } from "@nodegui/react-nodegui";
import { View, Text, CheckBox, Button } from "@nodegui/react-nodegui";
import { QFileDialog } from "@nodegui/nodegui";
import { nativeErrorHandler } from "../utils";
import { styles } from "../styles";

type Props = {
  options: Array<OptionT>;
  onUpdate?: (options: Array<OptionT>) => void;
};
type State = {
  height: number;
};
type OptionKey = keyof OptionT;
const types_name = {
  audio: "音频",
  keyboard: "按键",
  script: "脚本",
};
export class SettingView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      height: this.computeHeight(props.options),
    };
  }
  private options: Array<OptionT> = JSON.parse(
    JSON.stringify(this.props.options)
  );
  private notice_types: Array<NoticeT["type"]> = [
    "audio",
    "keyboard",
    "script",
  ];

  public computeHeight(options: Array<OptionT>) {
    let height = 160;
    for (let i = 0; i < options.length; i++) {
      height = height + 270;
      const item = options[i];
      for (let n = 0; n < item.notices.length; n++) {
        height = height + 140;
      }
    }
    return height;
  }

  public onUpdate = () => {
    if (!this.options.some((e) => e.enable)) {
      nativeErrorHandler("至少需要开启一个定时器");
      return;
    }
    if (this.props.onUpdate) {
      this.props.onUpdate(this.options);
    }
  };

  public addOptions = () => {
    this.options.unshift({
      name: "timer-" + Date.now(),
      display_name: "请输入名称",
      enable: false,
      value: 90,
      display_value: 90,
      notices: [],
    });
    this.setState({ height: this.computeHeight(this.options) });
  };

  public delOptions = (index: number) => {
    if (this.options.length < 2) {
      nativeErrorHandler("至少需要保留一个定时器");
      return;
    }
    this.options.splice(index, 1);
    this.setState({ height: this.computeHeight(this.options) });
  };

  public changeOptions = (index: number, key: OptionKey, val: any) => {
    (this.options[index] as any)[key] = key === "value" ? Number(val) : val;
  };

  public addPerformEvent = (parentid: number) => {
    this.options[parentid].notices.unshift({
      target: 10,
      type: "keyboard",
      key_code: "",
      file_path: "",
    });
    this.setState({ height: this.computeHeight(this.options) });
  };

  public delPerformEvent = (parentid: number, index: number) => {
    this.options[parentid].notices.splice(index, 1);
    this.setState({ height: this.computeHeight(this.options) });
  };

  public changePerformEvent = (
    parentid: number,
    index: number,
    key: string,
    val: any
  ) => {
    (this.options[parentid].notices[index] as any)[key] =
      key === "target" ? Number(val) : val;
  };

  public selectFile = (parentid: number, index: number) => {
    const fileDialog = new QFileDialog();
    fileDialog.exec();
    const value = fileDialog.selectedFiles();
    if (!value.length) {
      return;
    }
    const file = value[0];
    this.changePerformEvent(parentid, index, "file_path", file);
  };

  public render() {
    const { height } = this.state;
    return (
      <View style={styles.setting}>
        <ScrollArea style={styles.setting}>
          <View
            style={"paddingTop: 15px; paddingBottom: 15px;"}
            size={{ height: height, width: 415 }}
          >
            <View style={styles.setting_row}>
              <Text style={styles.setting_text}>启动/停止定时器快捷键:</Text>
              <LineEdit style={styles.setting_input} text={"F5"} />
            </View>
            <View style={styles.setting_row}>
              <Text style={styles.setting_text}>启动/停止脚本录制快捷键:</Text>
              <LineEdit style={styles.setting_input} text={"F6"} />
            </View>
            <View style={styles.setting_row}>
              <Text style={styles.setting_text}>定时器配置:</Text>
              <Button text={"新增定时器"} on={{ clicked: this.addOptions }} />
            </View>
            {this.options.map((e, i) => {
              return (
                <React.Fragment key={e.name + i}>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>定时器-{i + 1}:</Text>
                    <Button
                      style={styles.setting_delete}
                      text={"删除定时器"}
                      on={{ clicked: () => this.delOptions(i) }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>名称:</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.display_name}
                      on={{
                        textChanged: (text) =>
                          this.changeOptions(i, "display_name", text),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>倒计时:</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.value + ""}
                      on={{
                        textChanged: (text) =>
                          this.changeOptions(i, "value", text),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>是否启用:</Text>
                    <CheckBox
                      checked={e.enable}
                      on={{
                        clicked: (bool) =>
                          this.changeOptions(i, "enable", bool),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>是否循环:</Text>
                    <CheckBox
                      checked={e.loop}
                      on={{
                        clicked: (bool) => this.changeOptions(i, "loop", bool),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>名称颜色(可选):</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.display_name_color || "#4CD964"}
                      on={{
                        textChanged: (text) =>
                          this.changeOptions(i, "display_name_color", text),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>倒计时颜色(可选):</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.value_color || "#FF5959"}
                      on={{
                        textChanged: (text) =>
                          this.changeOptions(i, "value_color", text),
                      }}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>触发事件配置:</Text>
                    <Button
                      text={"新增事件"}
                      on={{ clicked: () => this.addPerformEvent(i) }}
                    />
                  </View>
                  {e.notices.map((notice, index) => {
                    return (
                      <React.Fragment key={e.name + "fun" + index}>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>
                            事件-{index + 1}:
                          </Text>
                          <Button
                            style={styles.setting_delete}
                            text={"删除事件"}
                            on={{
                              clicked: () => this.delPerformEvent(i, index),
                            }}
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>阀值:</Text>
                          <LineEdit
                            style={styles.setting_input}
                            text={notice.target ? notice.target + "" : ""}
                            on={{
                              textChanged: (text) =>
                                this.changePerformEvent(
                                  i,
                                  index,
                                  "target",
                                  text
                                ),
                            }}
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>类型:</Text>
                          {this.notice_types.map((t) => {
                            return (
                              <CheckBox
                                key={e.name + t + index}
                                text={types_name[t]}
                                checked={notice.type === t}
                                on={{
                                  clicked: (bool) =>
                                    this.changePerformEvent(
                                      i,
                                      index,
                                      "type",
                                      bool ? t : ""
                                    ),
                                }}
                              />
                            );
                          })}
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>键码:</Text>
                          <LineEdit
                            style={styles.setting_input}
                            text={notice.key_code}
                            on={{
                              textChanged: (text) =>
                                this.changePerformEvent(
                                  i,
                                  index,
                                  "key_code",
                                  text
                                ),
                            }}
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>
                            音频/脚本路径:
                          </Text>
                          <Button
                            text={"选择文件"}
                            on={{ clicked: () => this.selectFile(i, index) }}
                          />
                        </View>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollArea>
        <View style={styles.setting_footer}>
          <Button
            text={"更新配置"}
            style={styles.setting_button}
            on={{ clicked: this.onUpdate }}
          />
        </View>
      </View>
    );
  }
}
