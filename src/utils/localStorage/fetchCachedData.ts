import { parseJSON } from "../parseJSON";
import { getData } from "./getData";

export const fetchCachedData = async (key: string) => {
  try {
    return await parseJSON(
      await getData(key),
      "fetchCachedData returned invalid JSON format"
    );
  } catch (error) {}
};
