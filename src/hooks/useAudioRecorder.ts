import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function ({ onFinish }: { onFinish?: (uri: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingRef = useRef<Audio.Recording | undefined>(undefined);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const [hasRecording, setHasRecording] = useState(false);

  const MAX_DURATION = 90000;

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.setProgressUpdateInterval(500);

      recordingRef.current = recording;
      setIsRecording(true);

      //   Max duration 1 minute

      recording.setOnRecordingStatusUpdate(async status => {
        setRecordingDuration(
          //  Convert to seconds AND round to nearest second
          Math.round(status.durationMillis / 1000)
        );
        if (status.durationMillis >= MAX_DURATION) {
          await stopRecording();
        }
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong with the recording"
      });

      stopRecording().catch(() => {});
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return;

    const recording = recordingRef.current;
    recordingRef.current = undefined;
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false
    });
    setIsRecording(false);
    setHasRecording(true);
    setRecordingDuration(recording._finalDurationMillis / 1000);
    const uri = recording.getURI();
    if (!uri)
      return Toast.show({
        type: "error",
        text1: "Something went wrong with the recording"
      });
    onFinish?.(uri);
    return uri;
  }

  // cleanup
  useEffect(() => {
    return () => {
      stopRecording().catch(() => {});
    };
  }, []);

  return {
    startRecording,
    stopRecording,

    isRecording,
    recordingDuration,
    MAX_DURATION_SECONDS: MAX_DURATION / 1000,
    MAX_DURATION_SECONDS_STRING: formatDuration(MAX_DURATION / 1000),
    formatDuration,
    recordingRef,
    hasRecording
  };
}
