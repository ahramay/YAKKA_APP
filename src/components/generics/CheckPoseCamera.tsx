import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants";
import { ContinueButton } from "./ContinueButton";

interface CheckPoseCameraProps {
  showCamera: boolean;
  setShowCamera: (props: boolean) => void;
  setPhoto: (props: any) => void;
  text?: string;
}

export const CheckPoseCamera = (props: CheckPoseCameraProps) => {
  const {
    text = "I'm ready to pose",
    showCamera,
    setShowCamera,
    setPhoto
  } = props;
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
      console.debug(photo);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <>
        <ContinueButton text={text} onPress={() => {}} disabled={true} />
      </>
    );
  }

  if (!permission.granted || !showCamera) {
    // Camera permissions are not granted yet
    return (
      <ContinueButton
        onPress={() => {
          requestPermission();
          setShowCamera(true);
        }}
        text={text}
      />
    );
  }

  function toggleCameraType() {
    setType((current: CameraType) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <>
      <ContinueButton
        onPress={() => {
          requestPermission();
        }}
        text={text}
      />

      {showCamera && (
        <Modal
          visible={showCamera}
          style={{ height: 500 }}
          onRequestClose={() => {
            setShowCamera(!showCamera);
          }}
        >
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: 500,
    width: "100%"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64
  },
  button: {
    width: 80,
    height: 80,
    borderWidth: 5,
    borderColor: colors.background
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  }
});
