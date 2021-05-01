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
  setting: {
    flex: 1,
    flexDirection: "column",
  },
  setting_scroll: {
    flex: 1,
  },
  setting_center: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  setting_footer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
  },
  setting_button: {
    flex: 1,
    height: 45,
    backgroundColor: "#4CD964",
    color: "#fff",
    fontSize: 18,
    borderRadius: 5,
  },
  setting_row: {
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  setting_text: {
    fontSize: 16,
    marginRight: 5,
  },
  setting_input: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  setting_delete: {
    backgroundColor: "#FF5959",
    color: "#fff",
    borderRadius: 3,
  },
  setting_item: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
});
