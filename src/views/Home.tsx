import React from "react";
import { View, Text } from "@nodegui/react-nodegui";
import { observer } from "mobx-react";
import { useStore } from "../stores";
import { styles } from "../styles";

export const HomeView = observer(() => {
  const store = useStore();
  return (
    <View style={styles.view}>
      {store.options.map((e) => {
        if (!e.enable) {
          return null;
        }
        return (
          <React.Fragment key={e.name}>
            <Text
              style={`${styles.text}color:${
                e.display_name_color || "#4CD964"
              };`}
            >
              {e.display_name || e.name}:
            </Text>
            <Text style={`${styles.value}color:${e.value_color || "#FF5959"};`}>
              {e.display_value || e.value}
            </Text>
          </React.Fragment>
        );
      })}
    </View>
  );
});
