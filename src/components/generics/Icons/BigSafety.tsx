import * as React from "react";
import Svg, { G, Path, SvgProps, Text, TSpan } from "react-native-svg";

export const BigSafety = (props: SvgProps) => {
  return (
    <Svg width={56} height={68} viewBox="0 0 56 68" {...props}>
      <G data-name="Group 3024">
        <G data-name="Group 2986">
          <G data-name="Polygon 7" fill="none">
            <Path
              d="M23.053 5.853a4 4 0 016.894 0l19.5 33.117A4 4 0 0146 45H7a4 4 0 01-3.447-6.03z"
              transform="translate(-208 -1.5) translate(210.892 1.5) translate(.108)"
            />
            <Path
              d="M26.5 4.883c-1.074 0-2.04.552-2.585 1.477L4.413 39.478a2.968 2.968 0 00-.02 3.01A2.968 2.968 0 006.998 44h39.004c1.09 0 2.064-.565 2.605-1.511a2.968 2.968 0 00-.02-3.011L29.085 6.36A2.973 2.973 0 0026.5 4.883m0-1c1.337 0 2.673.656 3.447 1.97L49.449 38.97c1.57 2.667-.352 6.03-3.447 6.03H6.998c-3.095 0-5.017-3.363-3.447-6.03L23.053 5.853a3.964 3.964 0 013.447-1.97z"
              fill="silver"
              transform="translate(-208 -1.5) translate(210.892 1.5) translate(.108)"
            />
          </G>
          <Text
            data-name="!"
            transform="translate(-206.25 -1.5) translate(210.892 1.5) translate(26.108 37)"
            fill="#ff0a0a"
            fontSize={27}
            fontFamily="Roboto_900Black"
            fontWeight={800}
          >
            <TSpan x={-5} y={0}>
              {"!"}
            </TSpan>
          </Text>
        </G>
        <Text
          transform="translate(-208 -1.5) translate(236 65.5)"
          fill="rgba(0,0,0,0.3)"
          fontSize={18}
          fontFamily="Roboto_400Regular"
        >
          <TSpan x={-27} y={0}>
            {"Safety"}
          </TSpan>
        </Text>
      </G>
    </Svg>
  );
};
