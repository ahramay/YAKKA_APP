import { format, isToday, isTomorrow, parseISO } from "date-fns";

export const yakkaTimeFormat = (date: string) => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "hh:mma");
};

export const yakkaDateFormat = (date: string) => {
  // If the date is today, return the the following string 'Today at 12:00pm'
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return `Today`;
  }
  // If the date is tomorrow, return the following string 'Tomorrow at 12:00pm'
  if (isTomorrow(parsedDate)) {
    return `Tomorrow`;
  }
  // Otherwise, return the following string 'Monday 12th of January at 12:00pm'
  return format(parsedDate, "d MMMM yyyy");
};

export const yakkaDateTimeFormat = (date: string) => {
  const parsedDate = parseISO(date);

  // If the date is today, return the the following string 'Today at 12:00pm'
  if (isToday(parsedDate)) {
    return `Today - ${format(parsedDate, "h:mma")}`;
  } // If the date is tomorrow, return the following string 'Tomorrow at 12:00pm'
  if (isTomorrow(parsedDate)) {
    return `Tomorrow - ${format(parsedDate, "h:mma")}`;
  } // Otherwise, return the following string 'Monday 12th of January at 12:00pm'
  return format(parsedDate, "d MMMM yyyy - hh:mma");
};
