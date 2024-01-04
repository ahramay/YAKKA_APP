import * as React from "react";
import Svg, { Path, Circle, SvgProps } from "react-native-svg";

function BellRedDotIcon(props: SvgProps) {
  return (
    <Svg width={18} height={20} viewBox="0 0 18 20" {...props}>
      <Path
        d="M8.749 20a2.5 2.5 0 002.5-2.5h-5a2.5 2.5 0 002.5 2.5zm8.414-5.848C16.408 13.341 15 12.121 15 8.125a6.169 6.169 0 00-5-6.061V1.25a1.249 1.249 0 10-2.5 0v.814a6.169 6.169 0 00-5 6.061c0 4-1.412 5.216-2.167 6.027A1.22 1.22 0 000 15a1.251 1.251 0 001.254 1.25h14.991A1.251 1.251 0 0017.5 15a1.22 1.22 0 00-.337-.848z"
        transform="translate(.001)"
        fill="#fff"
      />
      <Circle
        data-name="Ellipse 9"
        cx={4}
        cy={4}
        r={4}
        transform="translate(10)"
        fill="red"
      />
    </Svg>
  );
}

export default BellRedDotIcon;
