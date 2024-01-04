import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function BellIcon(props: SvgProps) {
  return (
    <Svg width={17.5} height={20} viewBox="0 0 17.5 20" {...props}>
      <Path
        d="M8.749 20a2.5 2.5 0 002.5-2.5h-5a2.5 2.5 0 002.5 2.5zm8.414-5.848C16.408 13.341 15 12.121 15 8.125a6.169 6.169 0 00-5-6.061V1.25a1.249 1.249 0 10-2.5 0v.814a6.169 6.169 0 00-5 6.061c0 4-1.412 5.216-2.167 6.027A1.22 1.22 0 000 15a1.251 1.251 0 001.254 1.25h14.991A1.251 1.251 0 0017.5 15a1.22 1.22 0 00-.337-.848z"
        transform="translate(.001)"
        fill="#fff"
      />
    </Svg>
  );
}

export default BellIcon;
