import { useQuery, UseQueryOptions } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { GetProfileResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export const useMyProfile = (options?: UseQueryOptions<GetProfileResponse>) =>
  useQuery<GetProfileResponse>(
    QueryKeys.MY_PROFILE,
    () => goFetchLite("users/me/profile", { method: "GET" }),
    {
      enabled: false,
      ...options
    }
  );
