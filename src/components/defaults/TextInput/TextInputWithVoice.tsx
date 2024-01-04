import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { TextInput } from "./TextInput";
import { TextInputProps } from "./TextInput.props";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants";
import Speech from "@react-native-voice/voice";
import { debounce } from "debounce";
interface TextInputWithVoiceProps extends Omit<TextInputProps, "onChange"> {
  onClosePress?: () => void;
  debounceTime?: number;
  onSearch: (text: string) => void;
  visible: boolean;
  callbackDependencies?: any[];
}

export default function TextInputWithVoice({
  onClosePress,
  debounceTime = 500,
  onSearch,
  visible,
  callbackDependencies = [],
  ...props
}: TextInputWithVoiceProps) {
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  useEffect(() => {
    (async () => {
      setSpeechAvailable((await Speech.isAvailable()) === 1 ? true : false);
    })();

    Speech.onSpeechError = e => {
      console.error("onSpeechError: ", e.error);
    };

    Speech.onSpeechResults = e => {
      setTextValue(e.value?.[0] || "");
    };

    return () => {
      Speech.destroy().then(Speech.removeAllListeners);
    };
  }, []);

  const startSpeech = async () => {
    setTextValue("");
    await Speech.start("en-US");
    setRecording(true);
  };

  const stopSpeech = async () => {
    await Speech.stop();
    setRecording(false);
  };

  useEffect(() => {
    debounceSearch(textValue);
  }, [textValue]);

  const handleClosePress = async () => {
    onClosePress && onClosePress();
    await stopSpeech();
    setTextValue("");
  };

  // Debounce search taking in the text value
  const debounceSearch = useCallback(
    debounce((text: string) => {
      onSearch(text);
    }, debounceTime || 500),
    callbackDependencies
  );

  if (!visible) {
    return null;
  }

  return (
    <View className={`flex-row items-center gap-x-4`}>
      {onClosePress !== undefined && (
        <TouchableOpacity
          onPress={handleClosePress}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }}
        >
          <Ionicons
            name="close-circle"
            size={22}
            color={colors.lightGreyBorder}
          />
        </TouchableOpacity>
      )}

      <View className="border flex-1 border-gray-300 rounded-xl flex-row justify-between items-center pr-2">
        <TextInput
          {...props}
          value={textValue}
          onChangeText={text => {
            setTextValue(text);
          }}
          className="flex-1 rounded-xl"
        />

        {speechAvailable && (
          <TouchableOpacity
            onPress={recording ? stopSpeech : startSpeech}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 30,
              right: 10
            }}
          >
            <Ionicons
              name={recording ? "stop" : "mic"}
              size={20}
              color={colors.greyText}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
