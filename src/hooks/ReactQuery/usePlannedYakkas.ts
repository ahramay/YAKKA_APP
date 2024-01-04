import {useQuery} from 'react-query';
import {QueryKeys} from '../../constants/queryKeys';
import {PlannedYakkasResponse} from '../../types/types';
import {goFetchLite} from '../../utils/goFetchLite';

export const usePlannedYakkas = () =>
  useQuery<PlannedYakkasResponse>(
    [QueryKeys.PLANNED_YAKKAS],
    () => goFetchLite(`yakkas/planned`, {method: 'GET'}),
    {}
  );
