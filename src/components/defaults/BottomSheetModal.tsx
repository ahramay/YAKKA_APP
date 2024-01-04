import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  ViewProps
} from "react-native";
import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { colors, Layout } from "../../constants";

type Props = Partial<BottomSheetModalProps> & {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  innerViewStyle?: ViewStyle;
  innerViewProps?: Omit<Omit<ViewProps, "style">, "children">;
  /**
   * Where the bottom modal will snap to, either an array of percents or numbers
   */
  snapPoints?: (string | number)[];
  /**
   * Stops the modal from closing when a value is selected
   */
  disableDismissOnSelect?: boolean;
  /**
   * Stops the modal from closing when the backdrop is pressed
   */
  disableDismissOnBackdropPress?: boolean;
  /**
   * Placeholder text that will be displayed when no value is selected
   */
  placeholderText?: string;
  /**
   * Text at head of the modal
   */
  title?: string;
  /**
   * Generic action when the sheet's position is changed
   */
  handleSheetChanges?: (index: number) => void;
};

export const BottomModal = (props: Props) => {
  const {
    isVisible,
    setIsVisible,
    snapPoints = [
      !Layout.isSmallDevice ? "35%" : "25%",
      !Layout.isSmallDevice ? "40%" : "30%"
    ],
    title = "Select an option",
    disableDismissOnBackdropPress = false,
    handleSheetChanges,
    style,
    children,
    innerViewStyle,
    innerViewProps,
    ...rest
  } = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const customHandleSheetChanges = useCallback((index: number) => {
    if (handleSheetChanges) {
      handleSheetChanges(index);
    }
  }, []);

  const handleDismissModalPress = useCallback(() => {
    if (!disableDismissOnBackdropPress) {
      setIsVisible(false);
      bottomSheetRef.current?.dismiss();
    }
  }, []);

  const customSnapPoints = useMemo(() => snapPoints, []);
  const blurValue = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(blurValue.current, {
      toValue: 5,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={customSnapPoints}
      handleIndicatorStyle={{ height: 0 }}
      onChange={customHandleSheetChanges}
      backgroundStyle={{ backgroundColor: colors.chatBoxBackground }}
      style={[{ paddingHorizontal: 15 }, style]}
      backdropComponent={() => (
        <Pressable
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onTouchStart={handleDismissModalPress}
        />
      )}
      {...rest}
    >
      {children}
    </BottomSheetModal>
  );
};
