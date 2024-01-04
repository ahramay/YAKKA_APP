import { ViewStyle } from "react-native";
import { Svg, G, Circle, Path, Text, TSpan, SvgProps } from "react-native-svg";
import { colors } from "../../../constants";

export const YakkaGroup = (props: { svgProps?: SvgProps; color?: string }) => {
  const { svgProps, color = "#000" } = props;
  return (
    <Svg
      width={25.557}
      height={24.275}
      viewBox="0 0 25.557 24.275"
      {...svgProps}
    >
      <G data-name="Group 3028">
        <G
          data-name="Ellipse 10"
          transform="translate(-983 -4575) translate(986.14 4575)"
          fill="none"
          stroke={color}
          strokeWidth={1}
        >
          <Circle cx={8.516} cy={8.516} r={8.516} stroke="none" />
          <Circle cx={8.516} cy={8.516} r={8.016} />
        </G>
        <Path
          data-name="Path 1146"
          d="M1001.631 4586.653s2.629 1.345 4.781 2.689 1.494 6.722 1.494 6.722"
          fill="none"
          stroke={color}
          strokeWidth={1}
          transform="translate(-983 -4575)"
        />
        <Text
          transform="translate(-983 -4575) translate(990 4595.275)"
          fill="#03c04a"
          fontSize={16}
          fontWeight={800}
        >
          <TSpan x={-6} y={0}>
            {"G"}
          </TSpan>
        </Text>
      </G>
    </Svg>
  );
};
