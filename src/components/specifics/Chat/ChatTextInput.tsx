import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import { colors } from "../../../constants";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import usePhotos from "../../../hooks/usePhotos";
import { Message } from "../../../types/types";
import { blobToBase64 } from "../../../utils/fileUploads";
import { Text, TextInput } from "../../defaults";
type Params = Pick<Message, "content" | "type">;
export default function ChatTextInput(props: {
  sendMessage: (message: Params) => void;
  onChangeText: () => void;
}) {
  const [message, setMessage] = useState("");
  const handleSend = () => {
    props.sendMessage({
      content: message,
      type: "TEXT"
    });
    setMessage("");
  };

  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      // setPhoto({ photo: uri, photoB64: b64 });
      await props.sendMessage({
        content: b64,
        type: "IMAGE"
      });
    },
    allowsGallery: true,
    allowsEditing: false
  });
  const [height, setHeight] = useState<number>();

  const uploadAudio = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const b64 = await blobToBase64(blob);

    props.sendMessage({
      content: b64,
      type: "AUDIO"
    });
  };
  const {
    MAX_DURATION_SECONDS_STRING,
    recordingDuration,
    startRecording,
    stopRecording,
    isRecording,
    formatDuration,
    recordingRef
  } = useAudioRecorder({
    onFinish: uploadAudio
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ marginBottom: insets.bottom < 3 ? 10 : 0 }}
      className="w-full flex-row bg-white border-[#A7A7A7] border"
    >
      <TextInput
        editable={!isRecording}
        placeholder={isRecording ? "" : "Type a message..."}
        multiline
        returnKeyType="default"
        numberOfLines={12}
        onChangeText={message => {
          setMessage(message);
          props.onChangeText();
        }}
        value={message}
        onContentSizeChange={event => {
          setHeight(event.nativeEvent.contentSize.height + 20);
        }}
        style={[
          { minHeight: height, paddingTop: Platform.OS === "ios" ? 12 : 0 }
        ]}
        className="rounded-none flex-1 align-text-center"
      />
      <View className="flex flex-row items-center space-x-2 px-1">
        {/* If text has been entered, only show the send icon */}
        {message.length > 0 ? (
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={scale(22)} color={colors.greenYakka} />
          </TouchableOpacity>
        ) : (
          // Otherwise show the audio / image icons
          <>
            {/* Hide the camera icon if recording audio */}
            {!isRecording && (
              <TouchableOpacity className="py-1" onPress={start}>
                <Ionicons
                  className="py-1"
                  name="camera"
                  size={scale(28)}
                  color={colors.svgUserGrey}
                />
              </TouchableOpacity>
            )}
            {isRecording ? (
              // If recording, show the progress and the stop button
              <View className="flex-row items-center gap-x-4">
                <Text size="sm" color={colors.greyText}>
                  {formatDuration(recordingDuration)}/
                  {MAX_DURATION_SECONDS_STRING}
                </Text>
                <TouchableOpacity className="py-1" onPress={stopRecording}>
                  <Ionicons
                    name="stop"
                    size={scale(28)}
                    color={colors.svgUserGrey}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              // Otherwise show the mic button
              <TouchableOpacity className="p-1" onPress={startRecording}>
                <Ionicons
                  name="mic"
                  size={scale(28)}
                  color={colors.svgUserGrey}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}
