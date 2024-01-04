import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQuery } from "react-query";
import { colors } from "../../constants";
import { QueryKeys } from "../../constants/queryKeys";
import { hashtagSchema, hashtagsSchema } from "../../models";
import { goFetchLite } from "../../utils/goFetchLite";
import { Text, TextInput } from "../defaults";
import { Checkbox } from "../generics/Checkbox";
interface HashtagsProps {
  chosenHashtags: string[];
  setChosenHashtags: (item: string[]) => void;
  placeholder?:string;
  left?:number;
  paddingHorizontal?:number;
}

export const SelectHashtags = (props: HashtagsProps) => {
  const { chosenHashtags, setChosenHashtags, placeholder = "Start typing hashtags for your profile" , left = 15, paddingHorizontal = 40} = props
  const [hashtags, setHashtags] = useState<hashtagSchema[]>([]);
  const [hashtagText, setHashtagText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  console.log("hast",hashtags)

  const { data } = useQuery<hashtagsSchema>(
    [QueryKeys.INTERESTS_HASHTAGS],
    () =>
      goFetchLite("users/hashtags", {
        method: "GET"
      }),

    {
      refetchOnMount: true,
      onSuccess(data) {
        setHashtags(data.hashtags);
      },
      onError(err) {
        Toast.show({
          type: "error",
          text1: "Failed to get hashtags",
          //@ts-ignore
          text2: err?.response?.data?.message
        });
        return [];
      }
    }
  );

  const search = (val: string) => {
    setHashtagText(val);
    if (data?.hashtags) {
      let old = [...data?.hashtags];
      old = old.filter(item => {
        return item.name.toLowerCase().includes(val.toLowerCase());
      });
      setHashtags(old);
    }
  };

  const RenderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    return (
      <View style={styles.pillBox}>
        <Text size="sm" weight="500">
          #{item}
        </Text>
        <TouchableOpacity
          onPress={() => {
            let old = chosenHashtags.filter((p, i) => i !== index);
            setChosenHashtags(old);
          }}
          style={{
            backgroundColor: colors.lightGreyBorder,
            borderRadius: 20,
            padding: 3,
            marginLeft: 5
          }}
        >
          <Ionicons name="close" size={13} color={colors.greenYakka} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {chosenHashtags && (
        <View style={{ height: 43 }}>
          <FlatList
            data={chosenHashtags}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
            renderItem={RenderItem}
          />
        </View>
      )}
      {loading ? (
        <ActivityIndicator size={30} color={colors.background} />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text
              weight="900"
              style={{
                fontSize: 22,
                position: "absolute",
                left: left,
                zIndex: 100
              }}
            >
              #
            </Text>
            <TextInput
              placeholder={placeholder}
              style={{ paddingHorizontal: paddingHorizontal }}
              value={hashtagText}
              onChangeText={search}
              onSubmitEditing={() => {
                chosenHashtags !== undefined
                  ? setChosenHashtags([...chosenHashtags, hashtagText])
                  : setChosenHashtags([hashtagText]);
                setHashtagText("");
              }}
            />
            {hashtagText.length > 0 && (
              <TouchableOpacity
                style={{ position: "absolute", right: 15, zIndex: 100 }}
                onPress={() => setHashtagText("")}
              >
                <Ionicons name="close-circle-outline" size={20} />
              </TouchableOpacity>
            )}
          </View>
          {hashtagText && hashtagText?.length > 0 && hashtags.length > 0 && (
            <View
              style={{
                backgroundColor: colors.background,
                height: 200,
                borderRadius: 8,
                marginTop: 20,
                padding: 15
              }}
            >
              <FlatList
                data={hashtags}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                renderItem={({ item }) => (
                  <Checkbox
                    text={`#${item.name}`}
                    isChecked={
                      chosenHashtags.filter(tag => item.name === tag).length > 0
                    }
                    onPress={isChecked => {
                      if (!isChecked) {
                        let old = chosenHashtags.filter(
                          tag => item.name !== tag
                        );
                        setChosenHashtags(old);
                      } else {
                        setChosenHashtags([...chosenHashtags, item.name]);
                      }
                    }}
                  />
                )}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pillBox: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    height: 33,
    backgroundColor: colors.background
  }
});
