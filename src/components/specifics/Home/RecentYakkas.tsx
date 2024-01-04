import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useRecentYakkas } from "../../../hooks/ReactQuery/useRecentYakkas";
import { RecentYakka } from "../../../types/types";
import ColouredList from "../../generics/ColouredList";
import AddReviewModal from "../Reviews/AddReviewModal";
import YakkaListItem from "./YakkaListItem";
import EmptyList from "../../generics/Icons/EmptyList";

export default function RecentYakkas() {
  const yakkaListQuery = useRecentYakkas();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedYakka, setSelectedYakka] = useState<number | null>(null);

  return (
    <>
      <AddReviewModal
        yakka={
          yakkaListQuery.data?.pages
            .flatMap(page => page.recent)
            .find(yakka => yakka.id === selectedYakka) as RecentYakka
        }
        isOpen={isReviewModalOpen}
        setIsOpen={() => setIsReviewModalOpen(false)}
      />
      {yakkaListQuery.data?.pages && (
        <ColouredList
          onEndReached={() => {
            yakkaListQuery.fetchNextPage();
          }}
          ListEmptyComponent={() => {
            return <EmptyList />;
          }}
          startZIndex={99}
          items={yakkaListQuery.data.pages.flatMap(page =>
            page.recent.map(yakka => ({
              data: yakka,
              content: (
                <YakkaListItem
                  onOpenReviewModal={() => {
                    setIsReviewModalOpen(true);
                    setSelectedYakka(yakka.id);
                  }}
                  yakka={yakka}
                  type={"recent"}
                />
              )
            }))
          )}
        />
      )}
    </>
  );
}
