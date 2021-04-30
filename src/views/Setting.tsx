import React from "react";
import { View, Text, CheckBox, Button } from "@nodegui/react-nodegui";
import { nativeErrorHandler } from "../utils";
import { styles } from "../styles";

type Props = {
  options: Array<OptionT>;
  onUpdate?: (options: Array<OptionT>) => void;
};
export class SettingView extends React.Component<Props> {
  private options: Array<OptionT> = JSON.parse(
    JSON.stringify(this.props.options)
  );

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

  public render() {
    return (
      <View style={styles.setting}>
        <Text style={styles.setting_title}>选择定时器</Text>
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
        </View>
        <Button text={"更新配置"} on={{ clicked: this.onUpdate }} />
      </View>
    );
  }
}
