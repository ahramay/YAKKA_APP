import { View, Platform, PixelRatio } from "react-native";
import React, { useState } from "react";
import DateTimePicker, {
  BaseProps
} from "@react-native-community/datetimepicker";
import { colors, Layout } from "../../constants";
import { yakkaTimeFormat } from "../../utils/dateFormat";
import { Text } from "./Text/Text";
import { format } from "date-fns";
type OnChange = (date: Date) => void;
export type Time = { date: Date; startTime: Date; endTime: Date };
interface Props {
  time: Time;
  setTime: (time: Time) => void;
  disabled?: boolean;
}

export default function DatePicker({ time, setTime, disabled = false }: Props) {
  const [androidDateVisible, setAndroidDateVisible] = useState(false);
  const [androidStartTimeVisible, setAndroidStartTimeVisible] = useState(false);
  const [androidEndTimeVisible, setAndroidEndTimeVisible] = useState(false);
  const nth = function (d: number) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const minStartTime =
    format(time.date, "d MMMM yyyy") === format(new Date(), "d MMMM yyyy")
      ? new Date(new Date().getTime() + 10 * 60000)
      : new Date(new Date(time.date).setHours(0, 0, 0, 0));

  const scale = PixelRatio.getFontScale();
  console.log(scale);
  const dateValueTextClassName = "opacity-60 px-3";
  return (
    <View
      className={`flex flex-row max-w-xl ${
        Layout.isSmallDevice ? "gap-x-0.5" : "gap-x-2"
      } items-center`}
    >
      {Platform.OS == "ios" ? (
        <>
          <DateTimePicker
            themeVariant="light"
            accentColor={colors.greenYakka}
            value={time.date}
            disabled={disabled}
            mode="date"
            display={"default"}
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setTime({
                  date: selectedDate,
                  endTime: new Date(
                    selectedDate.getTime() +
                      (time.endTime.getTime() - time.startTime.getTime())
                  ),
                  startTime: selectedDate
                });
              }
            }}
            minimumDate={new Date()}
          />
          <View
            className={`${
              scale < 1.2 ? "flex-row" : "flex-col"
            } flex-wrap flex-1 items-center gap-y-1`}
          >
            <DateTimePicker
              themeVariant="light"
              accentColor={colors.greenYakka}
              value={time.startTime}
              mode="time"
              display={"default"}
              disabled={disabled}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setTime({
                    date: selectedDate,
                    endTime: new Date(
                      selectedDate.getTime() +
                        (time.endTime.getTime() - time.startTime.getTime())
                    ),
                    startTime: selectedDate
                  });
                }
              }}
              minimumDate={minStartTime}
            />
            <Text className={dateValueTextClassName}>to</Text>
            <DateTimePicker
              themeVariant="light"
              accentColor={colors.greenYakka}
              value={time.endTime}
              mode="time"
              display={"default"}
              disabled={disabled}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setTime({ ...time, endTime: selectedDate });
                }
              }}
              minimumDate={time.startTime}
            />
          </View>
        </>
      ) : (
        <>
          <View
            style={{ backgroundColor: '#F9F9F9EF' , borderColor: '#00000080'}}
            className={`flex-1  items-start rounded-md opacity-60 p-1 border-[0.8px]`}
          >
            <Text
              allowFontScaling={false}
              onPress={() => setAndroidDateVisible(true)}
              style={{color: '#707070'}}
            >{/*{`${time.date.getDate()}${nth(time.date.getDate())} ${
              month[time.date.getMonth()]
            } ${time.date.getFullYear()}`}*/}
              Date
            </Text>
          </View>
          <View className="flex-row gap-x-2 items-center">
            <Text
              allowFontScaling={false}
              style={{ backgroundColor: '#F9F9F9EF', paddingRight: 20, color: '#707070', borderColor: '#00000080' }}
              onPress={() => setAndroidStartTimeVisible(true)}
              className="opacity-60 p-1 rounded-md border-[0.8px]"
            >
              {/*{yakkaTimeFormat(time.startTime.toISOString())}*/}
              Start
            </Text>
            <Text allowFontScaling={false} className="opacity-60">
             to
            </Text>
            <Text
              allowFontScaling={false}
              style={{ backgroundColor: '#F9F9F9EF', paddingRight: 20, color: '#707070', borderColor: '#00000080' }}
              onPress={() => setAndroidEndTimeVisible(true)}
              className="opacity-60 p-1 rounded-md border-[0.8px]"
            >
              {/*{yakkaTimeFormat(time.endTime.toISOString())}*/}
              End
            </Text>
          </View>
          {androidDateVisible && (
            <DateTimePicker
              textColor="black"
              accentColor={colors.greenYakka}
              value={time.date}
              disabled={disabled}
              mode="date"
              display={"default"}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setAndroidDateVisible(false);
                  setTime({
                    date: selectedDate,
                    endTime: new Date(
                      selectedDate.getTime() +
                        (time.endTime.getTime() - time.startTime.getTime())
                    ),
                    startTime: selectedDate
                  });
                }
              }}
              minimumDate={new Date()}
            />
          )}
          {androidStartTimeVisible && (
            <DateTimePicker
              accentColor={colors.greenYakka}
              value={time.startTime}
              mode="time"
              display={"default"}
              disabled={disabled}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setAndroidStartTimeVisible(false);
                  setTime({
                    endTime: new Date(
                      selectedDate.getTime() +
                        (time.endTime.getTime() - time.startTime.getTime())
                    ),
                    date: selectedDate,
                    startTime: selectedDate
                  });
                }
              }}
            />
          )}
          {androidEndTimeVisible && (
            <DateTimePicker
              accentColor={colors.greenYakka}
              value={time.endTime}
              mode="time"
              display={"default"}
              disabled={disabled}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setAndroidEndTimeVisible(false);
                  setTime({ ...time, endTime: selectedDate });
                }
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
