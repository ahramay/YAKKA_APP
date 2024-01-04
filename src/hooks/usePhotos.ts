import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
interface usePhotoParams {
  uploadPhoto: (base64: string, uri: string) => void;
  allowsEditing?: boolean;
  allowsGallery?: boolean;
  strictSize?: boolean;
  aspect?: [number, number];
  allowsMultipleSelection?: boolean;
}
export default function usePhotos({
  uploadPhoto,
  aspect,
  allowsGallery = true,
  allowsEditing = true,
  strictSize = false,
  allowsMultipleSelection = false
}: usePhotoParams) {
  const compressBase64 = async (
    image: string,
    {
      height,
      width
    }: {
      height: number;
      width: number;
    }
  ) => {
    // Half the size of the images if they are too big
    let resizeWidth = width;
    let resizeHeight = height;
    if (!strictSize) {
      if (width > 1000) {
        resizeWidth = width / 2;
        resizeHeight = height / 2;
      }
    }
    const result = await ImageManipulator.manipulateAsync(
      image,
      [
        {
          resize: {
            height: resizeHeight,
            width: resizeWidth
          }
        }
      ],
      {
        base64: true,
        compress: 0.7
      }
    );

    return result.base64;
  };

  const verifyGalleryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    if (!(await verifyGalleryPermissions())) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: allowsEditing,
      base64: true,
      allowsMultipleSelection,
      aspect: aspect
    });

    if (!result.canceled) {
      if (allowsMultipleSelection) {
        const compressed = await Promise.all(
          result.assets.map(async asset => {
            const { base64, height, width, uri } = asset;
            const compressed = await compressBase64(uri, { height, width });
            if (!compressed) return;

            uploadPhoto(compressed, uri);
          })
        );

        return;
      }

      if (result.assets[0].base64) {
        const { base64, height, width, uri } = result.assets[0];
        const compressed = await compressBase64(uri, { height, width });
        if (!compressed) return;

        uploadPhoto(compressed, uri);

        return;
      }
      Toast.show({
        type: "error",
        text1: "Something went wrong"
      });
    }
  };
  const verifyCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return false;
    }

    return true;
  };

  const takePhoto = async () => {
    if (!(await verifyCameraPermissions())) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: allowsEditing,
      // @ts-ignore some reason isn't in the documentation but works 🙃
      cameraType: "front",
      base64: true,
      aspect: aspect
    });

    if (!result.canceled) {
      if (result.assets[0].base64) {
        const { height, width, uri } = result.assets[0];
        const compressed = await compressBase64(uri, { height, width });
        if (!compressed) return;

        uploadPhoto(compressed, uri);

        return;
      }
      Toast.show({
        type: "error",
        text1: "Something went wrong"
      });
    }
  };

  const start = () => {
    if (allowsGallery)
      Alert.alert(
        "Choose Image Source",
        "Import from Camera or Image Gallery?",
        [
          { text: "Camera", onPress: takePhoto },
          { text: "Gallery", onPress: pickImage }
        ],
        { cancelable: true }
      );
    else {
      takePhoto();
    }
  };
  return { start };
}
