import { useQuery, UseQueryOptions } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { YakkaRequest } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export const useYakkaRequests = (id: number) =>
  useQuery<{ yakkaRequests: YakkaRequest[] }>(
    QueryKeys.YAKKA_REQUESTS,
    () => goFetchLite(`yakkas/requests`, { method: "GET" }),
    {}
  );
