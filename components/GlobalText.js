import { Text as RNText } from "react-native";

// Optional: Add default props like className, style if needed
export function Text(props) {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: "BebasNeue" }, props.style]}
    />
  );
}
