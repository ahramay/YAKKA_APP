export function TimeSince(timestamp: number) {
  var seconds = Math.floor(
    new Date().getTime() / 1000 - new Date(timestamp).getTime() / 1000
  );
  if (seconds < 0) {
    seconds = 0;
  }
  // console.log('here are the seconds', seconds);
  var interval = seconds / 31536000;
  const singularityTest = (interval: number) =>
    Math.floor(interval) == 1 ? "" : "s";
  const getStringData = () => {
    if (interval > 1) {
      return (
        Math.floor(interval) + " year" + singularityTest(interval) + " ago"
      );
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return (
        Math.floor(interval) + " month" + singularityTest(interval) + " ago"
      );
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " day" + singularityTest(interval) + " ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return (
        Math.floor(interval) + " hour" + singularityTest(interval) + " ago"
      );
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " min" + singularityTest(interval) + " ago";
    }
    return Math.floor(seconds) + " sec" + singularityTest(seconds) + " ago";
  };
  const string = getStringData();
  return { number: seconds, string: string };
}
// var aDay = 24 * 60 * 60 * 1000;
// console.log(timeSince(new Date(Date.now() - aDay)));
// console.log(timeSince(new Date(Date.now() - aDay * 2)));
