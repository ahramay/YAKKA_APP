import { useInfiniteQuery, useQuery, UseQueryOptions } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { FindFriendsResponse, GetProfileResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export const useFriends = (filterQueryParams?: any) =>
  useInfiniteQuery<FindFriendsResponse>(
    [QueryKeys.FRIENDS, filterQueryParams],
    ({ pageParam }) => {
      return goFetchLite("users/find/friends", {
        method: "GET",
        params: { ...filterQueryParams, page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true
    }
  );
