import { GestureResponderEvent, View } from "react-native";
import { colors } from "../../../../constants";
import { Text } from "../../../defaults";
import { CancelSubmitButtons } from "../../../generics/CancelSubmitButtons";

export const AreYouSure = (props: {
  title?: string;
  content?: string;
  onPressCancel: (event: GestureResponderEvent) => void;
  onPressSubmit: (event: GestureResponderEvent) => void;
  submitText?: string;
  destructiveButtonIndex?: 0 | 1;
}) => {
  const {
    title,
    content,
    onPressCancel,
    onPressSubmit,
    submitText,
    destructiveButtonIndex = 1
  } = props;

  return (
    <View>
      {title && (
        <Text style={{ paddingBottom: 25 }} size="lg" color={colors.dim}>
          {title}
        </Text>
      )}
      {content && <Text size="lg">{content}</Text>}
      <CancelSubmitButtons
        destructiveButtonIndex={destructiveButtonIndex}
        onPressCancel={onPressCancel}
        onPressSubmit={onPressSubmit}
        submitText={submitText}
      />
    </View>
  );
};
