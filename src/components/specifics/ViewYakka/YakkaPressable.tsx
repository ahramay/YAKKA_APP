import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, PressableProps } from "react-native";
import ViewYakkaModal from "./ViewYakkaModal";

interface YakkaPressableProps extends Omit<PressableProps, "onPress"> {
  yakkaId: number;
}

export const YakkaPressable = (props: YakkaPressableProps) => {
  const [yakkaVisible, setYakkaVisible] = useState<boolean>(false);
  const { yakkaId, ...rest } = props;

  //code for getting a yakka
  //const {data} = useYakka(yakkaId)
  return (
    <>
      <Pressable {...rest} onPress={() => setYakkaVisible(true)} />
      {yakkaVisible && (
        <ViewYakkaModal
          visible={yakkaVisible}
          setVisible={setYakkaVisible}
          yakkaId={yakkaId}
        />
      )}
    </>
  );
};
