import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const HomeSVG = (props: SvgProps) => {
  const { color = "#fff", ...rest } = props;
  return (
    <Svg
      width="30px"
      height="30px"
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      {...props}
    >
      <Path
        d="M12.391 4.262a1 1 0 00-1.46.035l-6.177 6.919a1 1 0 00-.254.666V19.5a1 1 0 001 1h3a1 1 0 001-1V16a1 1 0 011-1h3a1 1 0 011 1v3.5a1 1 0 001 1h3a1 1 0 001-1v-7.591a1 1 0 00-.287-.7l-6.822-6.947z"
        stroke={color}
      />
    </Svg>
  );
};
