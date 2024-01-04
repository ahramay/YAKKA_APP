import { useQuery, UseQueryOptions } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { GetProfileResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export const useGroup = (
  id: number,
  options?: UseQueryOptions<GetProfileResponse>
) =>
  useQuery<GetProfileResponse>(
    QueryKeys.userProfile(id)
,
    () => goFetchLite(`groups/${id}`, { method: "GET" }),
    { ...options }
  );