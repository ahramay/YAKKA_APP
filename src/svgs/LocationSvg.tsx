import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.118}
      height={20}
      viewBox="0 0 14.118 20"
      {...props}
    >
      <Path
        data-name="Path 1147"
        d="M745.536 1491.051a7.059 7.059 0 00-7.059 7.059c0 5.911 7.059 12.941 7.059 12.941s7.059-7.485 7.059-12.941a7.059 7.059 0 00-7.059-7.059zm0 12.527a5.31 5.31 0 115.309-5.309 5.31 5.31 0 01-5.309 5.309z"
        transform="translate(-738.477 -1491.051)"
        fill="silver"
      />
    </Svg>
  )
}

export default SvgComponent