import * as React from "react";
import Svg, { G, Path, SvgProps, Text, TSpan } from "react-native-svg";



export const Safety = ({color, style, ...rest}: SvgProps & {color:string}) => {
  return (
    <Svg width={28} height={25} viewBox="0 0 28 25" {...rest} style={{marginLeft: -4}} >
      <G data-name="Group 2986">
        <G data-name="Polygon 7" fill="none">
          <Path
            d="M10.545 5.923a4 4 0 016.91 0l7.036 12.061A4 4 0 0121.036 24H6.964a4 4 0 01-3.455-6.015z"
            transform="translate(-208 -577) translate(208 577)"
          />
          <Path
            d="M14 4.939a2.971 2.971 0 00-2.591 1.488L4.373 18.488a2.969 2.969 0 00-.01 3.006A2.969 2.969 0 006.964 23h14.072c1.087 0 2.06-.563 2.601-1.506a2.969 2.969 0 00-.01-3.006L16.591 6.427A2.971 2.971 0 0014 4.939m0-1c1.342 0 2.683.661 3.455 1.984l7.036 12.062C26.047 20.65 24.123 24 21.036 24H6.964c-3.087 0-5.01-3.349-3.455-6.015l7.036-12.062A3.963 3.963 0 0114 3.94z"
            fill={color}
            transform="translate(-208 -577) translate(208 577)"
          />
        </G>
        <Text
          data-name="!"
          transform="translate(-208 -577) translate(223 598)"
          fill="#ff0a0a"
          fontSize={16}
          fontWeight={500}
        >
          <TSpan x={-4} y={0}>
            {"!"}
          </TSpan>
        </Text>
      </G>
    </Svg>
  );
};
