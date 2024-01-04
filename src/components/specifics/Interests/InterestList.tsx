import { memo } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQuery } from "react-query";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import { interestSchema } from "../../../models";
import { goFetchLite } from "../../../utils/goFetchLite";
import { CollapsibleInterests } from "./CollapsibleInterests";

export interface InterestListProps {
  chosenInterests: number[];
  setChosenInterests: (interests: number[]) => void;
  interestsFetched?: boolean;
  collapsedByDefault?: boolean;
  color?: string;
}



export const InterestList = memo((props: InterestListProps) => {
  const {
    chosenInterests,
    setChosenInterests,
    color = colors.background
  } = props;
  
  console.log(chosenInterests)
  const { data, isLoading } = useQuery<interestSchema>(
    QueryKeys.INTERESTS,
    () =>
      goFetchLite("users/interests", {
        method: "GET"
      }),
    {
      onSuccess: (data: any) => {
        console.log(data);
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Error getting interests to display`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );
  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size={30}
          color={colors.black}
          style={{ marginTop: 35 }}
        />
      ) : (
        <FlatList
          data={data?.interests}
          style={{ maxHeight: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CollapsibleInterests
              chosenInterests={chosenInterests}
              setChosenInterests={setChosenInterests}
              interest={item}
              color={color}
            />
          )}
        />
      )}
    </>
  );
});
