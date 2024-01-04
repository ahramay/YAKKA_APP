import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation, useQuery } from "react-query";
import { Button, Text, TextInput } from "../../../components";
import { Checkbox } from "../../../components/generics/Checkbox";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import { hashtagSchema, hashtagsSchema } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { GetProfileResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function InterestsHashtagScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"InterestHashtags">) {
  const [chosenHashtags, setChosenHashtags] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<hashtagSchema[]>([]);
  const [hashtagText, setHashtagText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useQuery<hashtagsSchema>(
    [QueryKeys.INTERESTS_HASHTAGS],
    () =>
      goFetchLite("users/hashtags", {
        method: "GET"
      }),

    {
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

  const addHashtags = useMutation<GetProfileResponse>(
    MutationKeys.INTERESTS_HASHTAGS,
    () =>
      goFetchLite("users/me/hashtags", {
        method: "POST",
        body: {
          hashtags: chosenHashtags.length > 0 ? chosenHashtags : ["YAKKA"]
        }
      }),
    {
      onSuccess: () => {
        signupNextNav({ navigation: navigation, routeName: routeState.name });
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Hashtags failed to update`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );

  const routeState = useRoute();
  const onPress = async () => {
    await addHashtags.mutateAsync();
  };

  return (
    <MottledGreenBackground style={styles.container}>
      <SafeAreaView style={styles.topContainer}>
        <View style={{ flexDirection: "row" }}>
          <SmartBackButton />
          <View style={{ flex: 1 }} />
          <Button preset="link" text="Next" textSize="xl" onPress={onPress} />
        </View>
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          What are your main interests?
        </Text>
        <Text
          style={{
            alignSelf: "center",
            textAlign: "center",
            paddingVertical: 20,
            paddingHorizontal: 15
          }}
        >
          You can also use #hashtags to discover yakkas that will be of interest
          to you.
        </Text>
        {chosenHashtags && (
          <FlatList
            data={chosenHashtags}
            showsHorizontalScrollIndicator={false}
            style={{ height: 33 }}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
            renderItem={RenderItem}
          />
        )}
      </SafeAreaView>
      {loading ? (
        <ActivityIndicator size={30} color={colors.background} />
      ) : (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              weight="900"
              style={{
                fontSize: 22,
                position: "absolute",
                left: 15,
                zIndex: 100
              }}
            >
              #
            </Text>
            <TextInput
              placeholder="start typing hashtags for your profile"
              style={{ paddingLeft: 40 }}
              value={hashtagText}
              onChangeText={search}
              onSubmitEditing={() => {
                const newHashtags = hashtagText
                  .replace(/\s/g, "")
                  .split("#")
                  .filter(val => val.length > 0);
                chosenHashtags !== undefined
                  ? setChosenHashtags([...chosenHashtags, ...newHashtags])
                  : setChosenHashtags([...newHashtags]);
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
                    variant="circle"
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
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15
  },
  topContainer: {
    paddingBottom: 15
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  pillBox: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: colors.background
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
