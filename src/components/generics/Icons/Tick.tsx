import { Svg, G, Circle, Path, SvgProps } from "react-native-svg";
import { colors } from "../../../constants";

export const Tick = (props: { dimmed?: boolean; svgProps?: SvgProps }) => {
  const { dimmed = false, svgProps } = props;
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" {...svgProps}>
      <G data-name="Group 3030" transform="translate(-153 -344)">
        <Circle
          data-name="Ellipse 17"
          cx={11}
          cy={11}
          r={11}
          transform="translate(153 344)"
          fill={dimmed ? "#03c04a" : colors.lightGreyBorder}
        />
        <G
          data-name="Group 3029"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth={2}
        >
          <Path
            data-name="Line 303"
            transform="translate(157.5 355.5)"
            d="M0 0L5 6"
          />
          <Path
            data-name="Line 304"
            transform="translate(162.5 349.5)"
            d="M7 0L0 12"
          />
        </G>
      </G>
    </Svg>
  );
};
