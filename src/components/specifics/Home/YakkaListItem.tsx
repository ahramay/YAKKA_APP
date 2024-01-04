import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants";
import { PlannedYakka, RecentYakka } from "../../../types/types";
import { yakkaDateTimeFormat } from "../../../utils/dateFormat";
import { Text } from "../../defaults";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
import ImageWithStatus from "../../generics/ImageWithStatus";
import RequestStatusIndicator from "../../generics/RequestStatusIndicator";
import { UserPressable } from "../../generics/UserPressable";
import { YakkaPressable } from "../ViewYakka/YakkaPressable";

type YakkaListItemProps =
  | {
      yakka: PlannedYakka;
      type: "planned";
    }
  | {
      onOpenReviewModal: () => void;
      yakka: RecentYakka;
      type: "recent";
    };

export default function YakkaListItem(props: YakkaListItemProps) {
  return (
    <YakkaPressable
      yakkaId={props.yakka.id}
      className="flex-row justify-between items-center"
    >
      <View>
        <View className="flex-row items-center">
          <Text color="white" preset="b" size="lg">
            {props.yakka.attendee.firstName}
          </Text>
          {props.yakka.attendee.isVerified && (
            <VerifiedBadge style={{ marginLeft: 5 }} />
          )}
        </View>
        <Text size="sm" className="my-2" color="white" style={{ opacity: 0.8 }}>
          {yakkaDateTimeFormat(props.yakka.startTimestamp)}
        </Text>
        {props.type === "planned" && (
          <RequestStatusIndicator status={props.yakka.status} />
        )}
        {props.type === "recent" &&
          (props.yakka.yourReview ? (
            <View className="flex-row gap-x-1 h-6">
              {Array(props.yakka.yourReview.rating)
                .fill("")
                .map(r => (
                  <Ionicons name="star" color={colors.star} size={16} />
                ))}
            </View>
          ) : (
            <TouchableOpacity
              className="h-6 justify-center"
              onPress={() => {
                props.onOpenReviewModal();
              }}
            >
              <Text size="sm" color="white">
                Add review
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      <UserPressable userId={props.yakka.attendee.id}>
        <ImageWithStatus
          imageUrl={props.yakka.attendee.image}
          isVerified={props.yakka.attendee.isVerified}
          status={props.yakka.attendee.status}
        />
      </UserPressable>
    </YakkaPressable>
  );
}
