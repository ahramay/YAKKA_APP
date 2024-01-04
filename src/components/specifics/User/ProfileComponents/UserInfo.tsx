import { StyleSheet, View } from "react-native";
import { colors } from "../../../../constants";
import { interestSchema } from "../../../../models";
import { GetProfileResponse } from "../../../../types/types";
import { Text } from "../../../defaults";
import { weightObj } from "../../../defaults/Text/Text.presets";

export const UserInfo = (props: {
  user: GetProfileResponse;
  isUser: boolean;
}) => {
  const { user, isUser } = props;
  const getInterestsAsString = (interests: interestSchema[]) => {
    let array: string[] = interests.map(val => val.name);
    //Recursively goes through every name in the list
    return array.join(", ");
  };

  function flat(array?: interestSchema[]) {
    var result: interestSchema[] = [];
    if (array) {
      array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.subInterests)) {
          result = result.concat(flat(a.subInterests));
        }
      });
    }
    return result;
  }
  return (
    <View className="w-full -top-10 gap-y-4">
      <View style={styles.row}>
        <Text style={styles.leftText}>Gender</Text>
        <Text style={styles.rightText}>{user.gender}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.leftText}>Occupation</Text>
        <Text style={styles.rightText}>{user.jobTitle}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.leftText}>{isUser ? "My bio" : "Bio"}</Text>
        <Text style={styles.rightText}>{user.bio}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.leftText}>
          {isUser ? "My interests" : "Interests"}
        </Text>
        <Text style={styles.rightText}>
          {getInterestsAsString(flat(user.interests))}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 24,
    width: "100%"
  },
  leftText: {
    width: 90,
    textAlign: "right",
    marginRight: 10,
    fontFamily: weightObj["700"],
    fontSize: 15
  },
  rightText: {
    flexShrink: 1,
    fontSize: 15,
    color: colors.dim
  }
});
