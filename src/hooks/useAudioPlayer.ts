import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { audioAtom } from "../recoil/audioAtom";
export default function useAudioPlayer(audioUri: string) {
  //  Hook wich uses expo-av to manage audio playback
  // It should only allow one audio file to be loaded and played at a time

  const [currentAudio, setCurrentAudio] = useRecoilState(audioAtom);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentPositionSeconds, setCurrentPositionSeconds] = useState(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);

  const isLoaded = useRef(false);

  const sound = useRef<Audio.Sound | null>(null);

  const playSound = async () => {
    if (currentAudio) {
      unloadCurrentAudio();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUri
    });
    sound.current = newSound;
    isLoaded.current = true;
    await sound.current?.playAsync();
    sound.current.setProgressUpdateIntervalAsync(500);
    const initialStatus = await sound.current.getStatusAsync();
    // @ts-ignore
    setTotalDurationSeconds(
      Math.round(
        // @ts-ignore
        (initialStatus.durationMillis || initialStatus.playableDurationMillis) /
          1000
      )
    );
    sound.current.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) {
        return;
      }

      if (status.didJustFinish) {
        setCurrentPositionSeconds(0);
        setIsPlaying(false);
        // @ts-ignore
      } else if (status.isPlaying) {
        // @ts-ignore
        setCurrentPositionSeconds(Math.round(status.positionMillis / 1000));
      }
    });

    setIsPlaying(true);
    setCurrentAudio(newSound);
  };

  const stopSound = async () => {
    try {
      if (isLoaded.current) {
        await sound.current?.stopAsync();

        setIsPlaying(false);
      }
    } catch (err) {}
  };

  const seekTo = async (seconds: number) => {
    if (isLoaded.current) {
      await sound.current?.setPositionAsync(seconds * 1000);
    }
  };

  const unloadCurrentAudio = async () => {
    try {
      if (!currentAudio) return;
      const currentAudioStatus = await currentAudio.getStatusAsync();
      if (
        currentAudio &&
        currentAudioStatus.isLoaded &&
        currentAudioStatus.uri === audioUri
      ) {
        await currentAudio?.stopAsync();
        await currentAudio?.unloadAsync();
      }
    } catch (err) {}
  };

  useEffect(() => {
    const checkCurrentAudio = async () => {
      if (currentAudio) {
        const status = await currentAudio.getStatusAsync();
        // @ts-ignore
        if (status.uri !== audioUri) {
          setCurrentPositionSeconds(0);
          setIsPlaying(false);
        }
      }
    };
    if (currentAudio) checkCurrentAudio();
    // Cleanup function
    return () => {
      unloadCurrentAudio();
    };
  }, [currentAudio, audioUri]);

  return {
    playSound,
    stopSound,
    isPlaying,
    currentPositionSeconds,
    totalDurationSeconds,
    seekTo
  };
}
