import { useInfiniteQuery, useQuery } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { RecentYakkasResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export const useRecentYakkas = () =>
  useInfiniteQuery<RecentYakkasResponse>(
    [QueryKeys.RECENT_YAKKAS],
    ({ pageParam = `yakkas/recent` }) => {
      return goFetchLite(pageParam, { method: "GET" });
    },
    {
      getNextPageParam: lastPage =>
        lastPage.nextPage
          ? `yakkas/recent?page=${lastPage.nextPage}`
          : undefined
    }
  );
