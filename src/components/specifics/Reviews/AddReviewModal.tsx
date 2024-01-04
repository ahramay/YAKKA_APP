import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef
} from "react-native-autocomplete-dropdown";
import { Rating } from "react-native-ratings";
import { useMutation, useQueryClient } from "react-query";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import useCustomToast from "../../../hooks/useCustomToast";
import { RecentYakka } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Button, Text } from "../../defaults";
import { CancelSubmitButtons } from "../../generics/CancelSubmitButtons";
import CurvedModal, { CurvedModalProps } from "../../generics/CurvedModal";

interface AddReviewModalProps
  extends Omit<CurvedModalProps, "children" | "title"> {
  yakka: RecentYakka | null;
}

const reviewOptions = [
  "A great YAKKA thank you. I enjoyed our conversation",
  "A really helpful and enjoyable experience",
  "The YAKKA was fine thank you",
  "The YAKKA did not take place through no fault",
  "The person did not show up for our planned YAKKA",
  "I did not enjoy this YAKKA",
  "I felt unsafe / inappropriate conversation / other concern"
];

export default function AddReviewModal(props: AddReviewModalProps) {
  const [starRating, setStarRating] = useState<number | null>(null);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(
    null
  );

  const { toast, errorToast } = useCustomToast();

  const dropdownRef = useRef<AutocompleteDropdownRef | null>(null);

  const queryClient = useQueryClient();

  const reviewMutation = useMutation(
    () =>
      goFetchLite(`users/${props.yakka!.attendee.id}/review`, {
        method: "POST",
        body: {
          rating: starRating,
          comment: reviewOptions[selectedReviewIndex!],
          yakkaId: props.yakka!.id
        }
      }),
    {
      onSuccess: () => {
        toast("Review submitted successfully");
        queryClient.invalidateQueries(QueryKeys.RECENT_YAKKAS);
      },
      onError: (error: any) => {
        errorToast(
          "Review submission failed",
          error?.response?.data?.message || ""
        );
      },
      onSettled: () => {
        props.setIsOpen(false);
      }
    }
  );

  if (!props.yakka) return null;

  const openDropdown = () => {
    dropdownRef.current?.toggle();
  };

  const submitReviewHandler = async () => {
    reviewMutation.mutate();
  };

  return (
    <CurvedModal
      {...props}
      backdropOpacity={0}
      contentContainerClassName="space-y-6"
      title={props.yakka.attendee.firstName}
    >
      <View className="flex-row space-x-4 justify-between w-full items-center">
        <Text>Your rating</Text>
        <Rating
          onFinishRating={(rating: number) => setStarRating(rating)}
          startingValue={0}
          imageSize={24}
          style={{ paddingBottom: 2 }}
        />
      </View>
      <View className="flex-row space-x-4 justify-between w-full">
        <View className="w-full z-[100]">
          <Text className="mb-1">How did it go?</Text>
          <AutocompleteDropdown
            controller={controller => {
              dropdownRef.current = controller;
            }}
            containerStyle={{
              marginBottom: 10
            }}
            inputContainerStyle={{
              backgroundColor: colors.lightGreyBorder
            }}
            textInputProps={{
              placeholderTextColor: colors.dim,
              placeholder: "Select a review option",
              onPressIn: openDropdown,
              editable: false
            }}
            dataSet={reviewOptions.map((i, index) => ({
              id: index + "",
              title: i
            }))}
            onSelectItem={item => {
              if (!item) return;
              setSelectedReviewIndex(Number(item.id));
            }}
            useFilter={false}
          />
        </View>
      </View>
      <CancelSubmitButtons
        destructiveButtonIndex={0}
        onPressCancel={() => props.setIsOpen(false)}
        onPressSubmit={submitReviewHandler}
        disabled={
          selectedReviewIndex === null ||
          starRating === null ||
          reviewMutation.isLoading
        }
      />
    </CurvedModal>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 120
  }
});
