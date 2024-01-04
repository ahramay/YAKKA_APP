import { useIsFetching } from "react-query";

export default function Loading() {
  const isFetching = useIsFetching();
  //   TODO: Add a loading spinner etc
  if (isFetching) {
    return null;
  }
  return null;
}
