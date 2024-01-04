import React from "react";
import {
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface GroupUploadImageProps {
  onImageSelect: (base64Image: string) => void;
}

const GroupUploadImage: React.FC<GroupUploadImageProps> = ({
  onImageSelect
}) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled && result.uri) {
      // Check if result.uri is defined
      const base64Image = await convertToBase64(result.uri);
      onImageSelect(base64Image);
    }
  };

  const convertToBase64 = async (uri: string) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    });
    return `data:image/jpeg;base64,${file}`;
  };

  return (
    <View>
        <Button title="Selected" onPress={pickImage}/>
    </View>
  );
};

export default GroupUploadImage;
