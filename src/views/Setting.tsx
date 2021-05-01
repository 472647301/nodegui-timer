import React from "react";
import { ScrollArea, LineEdit } from "@nodegui/react-nodegui";
import { View, Text, CheckBox, Button } from "@nodegui/react-nodegui";
import { nativeErrorHandler } from "../utils";
import { styles } from "../styles";

type Props = {
  options: Array<OptionT>;
  onUpdate?: (options: Array<OptionT>) => void;
};
type OptionKey = keyof OptionT;
const types_name = {
  audio: "音频",
  keyboard: "按键",
  script: "脚本",
};
export class SettingView extends React.Component<Props> {
  private options: Array<OptionT> = JSON.parse(
    JSON.stringify(this.props.options)
  );
  private notice_types: Array<NoticeT["type"]> = [
    "audio",
    "keyboard",
    "script",
  ];

  public onUpdate = () => {
    if (!this.options.some((e) => e.enable)) {
      nativeErrorHandler("至少需要保留一个定时器");
      return;
    }
    if (this.props.onUpdate) {
      this.props.onUpdate(this.options);
    }
  };

  public clickedEnable = (bool: boolean, name: string) => {
    const index = this.options.findIndex((e) => {
      return e.name === name;
    });
    this.options[index] = Object.assign(this.options[index], {
      enable: bool,
    });
  };

  public displayText(key: OptionKey, index: number) {
    let text = "";
    switch (key) {
      case "name":
        text = "定时器" + index + 1;
        break;
      case "display_name":
        text = "名称";
        break;
      case "enable":
        text = "是否启用";
        break;
      case "value":
        text = "倒计时";
        break;
      case "display_name_color":
        text = "名称颜色(可选)";
        break;
      case "value_color":
        text = "倒计时颜色(可选)";
        break;
      case "value":
        text = "倒计时";
        break;
    }
    return text;
  }

  public render() {
    return (
      <View style={styles.setting}>
        <ScrollArea style={styles.setting}>
          <View style={styles.setting_center}>
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
              <Button text={"新增定时器"} />
            </View>
            {this.options.map((e, i) => {
              return (
                <React.Fragment key={e.name + i}>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>定时器-{i + 1}:</Text>
                    <Button style={styles.setting_delete} text={"删除定时器"} />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>名称:</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.display_name}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>倒计时:</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.value + ""}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>是否启用:</Text>
                    <CheckBox checked={e.enable} />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>是否循环:</Text>
                    <CheckBox checked={e.loop} />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>名称颜色(可选):</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.display_name_color || "#4CD964"}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>倒计时颜色(可选):</Text>
                    <LineEdit
                      style={styles.setting_input}
                      text={e.value_color || "#FF5959"}
                    />
                  </View>
                  <View style={styles.setting_item}>
                    <Text style={styles.setting_text}>触发事件配置:</Text>
                    <Button text={"新增事件"} />
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
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>阀值:</Text>
                          <LineEdit
                            style={styles.setting_input}
                            text={notice.target ? notice.target + "" : ""}
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>类型:</Text>
                          {this.notice_types.map((t) => {
                            return (
                              <CheckBox
                                key={e.name + t + index}
                                text={types_name[t]}
                              />
                            );
                          })}
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>键码:</Text>
                          <LineEdit
                            style={styles.setting_input}
                            text={notice.key_code}
                          />
                        </View>
                        <View style={styles.setting_item}>
                          <Text style={styles.setting_text}>
                            音频/脚本路径:
                          </Text>
                          <Button text={"选择文件"} />
                        </View>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </View>
          {/* <Text style={styles.setting_title}>选择定时器</Text>
        <View style={styles.setting_row}>
          {this.options.map((e) => {
            return (
              <CheckBox
                key={e.name}
                checked={e.enable}
                text={e.display_name}
                on={{ clicked: (bool) => this.clickedEnable(bool, e.name) }}
              />
            );
          })}
        </View> */}
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
