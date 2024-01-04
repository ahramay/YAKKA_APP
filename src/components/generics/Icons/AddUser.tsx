import { Circle, G, Path, Svg, SvgProps, Text, TSpan } from "react-native-svg";

export const AddUser = (props: SvgProps) => {
  return (
    <Svg
      width={27.557}
      height={29.275}
      viewBox="0 0 27.557 29.275"
      style={{ top: 2 }}
      {...props}
    >
      <G data-name="Group 6866">
        <G
          data-name="Ellipse 10"
          transform="translate(-981 -4575) translate(986.14 4575)"
          fill="none"
          stroke="silver"
          strokeWidth={1}
        >
          <Circle cx={8.516} cy={8.516} r={8.516} stroke="none" />
          <Circle cx={8.516} cy={8.516} r={8.016} />
        </G>
        <Path
          data-name="Path 1146"
          d="M1001.631 4586.653s2.629 1.345 4.781 2.689 1.494 6.722 1.494 6.722"
          fill="none"
          stroke="silver"
          strokeWidth={1}
          transform="translate(-981 -4575)"
        />
        <Text
          data-name="+"
          transform="translate(-981 -4575) translate(990 4598.275)"
          fill="#03c04a"
          fontSize={24}
          fontWeight={800}
        >
          <TSpan x={-8} y={0}>
            {"+"}
          </TSpan>
        </Text>
      </G>
    </Svg>
  );
};
