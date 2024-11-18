import { ToastAndroid } from "react-native";

export default function Toast(text) {
  ToastAndroid.show(text, ToastAndroid.SHORT);
}
