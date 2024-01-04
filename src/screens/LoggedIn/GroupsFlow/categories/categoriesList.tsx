import { memo } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQuery } from "react-query";
import { colors } from "../../../../constants";
import { QueryKeys } from "../../../../constants/queryKeys";
import { categoriesSchema } from "../../../../models";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { CollapsibleInterests } from "./CollapsibleInterests";

export interface CategoriesListProps {
  chosenCategories: number[];
  setChosenCategories: (categoriesListProps: number[]) => void;
  categoriesFetched?: boolean;
  collapsedByDefault?: boolean;
  color?: string;
}



export const CategoriesList = memo((props: CategoriesListProps) => {
  const {
    chosenCategories,
    setChosenCategories,
    color = colors.background
  } = props;
  
  console.log(chosenCategories)
  const { data, isLoading } = useQuery<categoriesSchema>(
    QueryKeys.CATEGORIES,
    () =>
      goFetchLite("/groups/categories", {
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
          data={data?.categories}
          style={{ maxHeight: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CollapsibleInterests
            chosenCategories={chosenCategories}
            setChosenCategories={setChosenCategories}
            interest={item}
            color={color}
            />
          )}
        />
      )}
    </>
  );
});
