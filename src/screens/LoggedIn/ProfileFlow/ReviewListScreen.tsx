import React from "react";
import { Text, View } from "react-native";
import ReviewList from "../../../components/specifics/Reviews/ReviewList";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";

export default function ReviewListScreen({
  route,
  navigation
}: RootLoggedInScreenProps<"ReviewList">) {
  return (
    <View>
      <ReviewList userId={route.params.userId} />
    </View>
  );
}
