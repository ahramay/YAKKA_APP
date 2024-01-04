import * as React from "react";
import Svg, { Defs, G, Rect, Circle, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Alarm(props: SvgProps) {
  return (
    <Svg width={218} height={218} viewBox="0 0 218 218" {...props}>
      <Defs></Defs>
      <G data-name="Group 6878" transform="translate(-59 6)">
        <G transform="translate(59 -6)" filter="url(#a)">
          <G
            data-name="Rectangle 2247"
            transform="translate(9 6)"
            fill="#fff"
            stroke="#707070"
            strokeWidth={1}
          >
            <Rect width={200} height={200} rx={36} stroke="none" />
            <Rect
              x={0.5}
              y={0.5}
              width={199}
              height={199}
              rx={35.5}
              fill="none"
            />
          </G>
        </G>
        <Rect
          data-name="Rectangle 2248"
          width={155}
          height={155}
          rx={30}
          transform="translate(91 23)"
          fill="#03c04a"
        />
        <Circle
          data-name="Ellipse 27"
          cx={56.5}
          cy={56.5}
          r={56.5}
          transform="translate(112 44)"
          fill="#fff"
        />
        <Circle
          data-name="Ellipse 28"
          cx={33.5}
          cy={33.5}
          r={33.5}
          transform="translate(135 67)"
          fill="#fc0000"
        />
      </G>
    </Svg>
  );
}

export default Alarm;
