import * as React from "react"
import Svg, {
  Ellipse,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop
} from "react-native-svg"

function FlagDownIcon(props) {
  return (
    <Svg
      width={128}
      height={233}
      viewBox="0 0 128 233"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Ellipse
        cx={44}
        cy={219.5}
        rx={44}
        ry={13.5}
        fill="#000"
        fillOpacity={0.4}
      />
      <Path d="M41 56v163.5h6V56h-6z" fill="#fff" />
      <Circle cx={44} cy={56} r={9} fill="#FF6651" />
      <Path
        d="M66.065 66H44v43h22.065A32.434 32.434 0 0189 118.5a32.434 32.434 0 0022.935 9.5H127.5V85h-15.565A32.436 32.436 0 0189 75.5 32.435 32.435 0 0066.065 66z"
        fill="url(#paint0_linear_84_1290)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_84_1290"
          x1={44}
          y1={128}
          x2={128}
          y2={128}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9214F5" />
          <Stop offset={0.385417} stopColor="#5B079D" />
          <Stop offset={0.53125} stopColor="#8210DC" />
          <Stop offset={0.666667} stopColor="#6509AD" />
          <Stop offset={1} stopColor="#9214F5" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default FlagDownIcon;
