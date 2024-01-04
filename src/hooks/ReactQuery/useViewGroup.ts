import { useQuery, UseQueryOptions } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { GetGroupResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";
import Toast from "react-native-toast-message";

export const useViewGroup = (
  id: number,
  options?: UseQueryOptions<GetGroupResponse>
) =>
  useQuery<GetGroupResponse>(
    QueryKeys.getGroup(id),
    () => goFetchLite(`groups/${id}`, { method: "GET" }),
    {
      ...options,
      onError: error => {
        console.log(error);
        Toast.show({ text1: "Error getting group" });
      }
    }
  );
