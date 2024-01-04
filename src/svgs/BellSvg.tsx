import { Path, Svg, SvgProps } from "react-native-svg";
import { colors } from "../constants";
interface BellProps extends SvgProps {
  color?: string;
}
export const BellSvg = (props: BellProps) => {
  const { color = colors.background, ...rest } = props;
  return (
    <Svg width={91.596} height={104.68} viewBox="0 0 91.596 104.68" {...rest}>
      <Path
        d="M89.835 74.072c-3.95-4.244-11.341-10.63-11.341-31.545 0-15.886-11.139-28.6-26.158-31.723V6.543a6.538 6.538 0 10-13.077 0V10.8C24.24 13.923 13.1 26.64 13.1 42.526c0 20.916-7.391 27.3-11.341 31.545A6.388 6.388 0 000 78.51a6.548 6.548 0 006.563 6.543h78.469a6.547 6.547 0 006.563-6.543 6.384 6.384 0 00-1.76-4.439zm-76.029 1.167c4.339-5.719 9.082-15.2 9.1-32.594 0-.041-.012-.078-.012-.119a22.9 22.9 0 1145.8 0c0 .041-.012.078-.012.119.022 17.4 4.766 26.878 9.1 32.594zM45.8 104.68A13.083 13.083 0 0058.876 91.6H32.718A13.083 13.083 0 0045.8 104.68z"
        transform="translate(.001)"
        fill={color}
      />
    </Svg>
  );
};
