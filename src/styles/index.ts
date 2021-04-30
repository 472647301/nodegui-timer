import { create } from "nodegui-stylesheet";

export const styles = create({
  win: {
    backgroundColor: "transparent",
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#4CD964",
    maxWidth: 150,
  },
  value: {
    fontSize: 20,
    color: "#FF5959",
    marginRight: 10,
    maxWidth: 70,
  },
  button: {
    width: 40,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
