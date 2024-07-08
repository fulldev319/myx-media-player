import * as React from "react"
import Svg, {
  Ellipse,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop
} from "react-native-svg"

function FlagUpIcon(props) {
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
      <Path
        d="M51.138 203.887l-6.25 6.25c-.12.114-.26.203-.413.263a1.25 1.25 0 01-.95 0 1.256 1.256 0 01-.413-.263l-6.25-6.25a1.251 1.251 0 01-.367-.887 1.257 1.257 0 011.255-1.255c.333 0 .652.132.888.367l4.112 4.125v-9.487a1.249 1.249 0 112.5 0v9.487l4.112-4.125a1.243 1.243 0 01.888-.369 1.24 1.24 0 01.888.369 1.264 1.264 0 01.37.888 1.253 1.253 0 01-.37.887z"
        fill="#FF6651"
      />
      <Path d="M41 9v163.5h6V9h-6z" fill="#fff" />
      <Circle cx={44} cy={9} r={9} fill="#FF6651" />
      <Path
        d="M66.065 19H44v43h22.065A32.435 32.435 0 0189 71.5a32.436 32.436 0 0022.935 9.5H127.5V38h-15.565A32.436 32.436 0 0189 28.5 32.435 32.435 0 0066.065 19z"
        fill="url(#paint0_linear_84_1161)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_84_1161"
          x1={44}
          y1={81}
          x2={128}
          y2={81}
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

export default FlagUpIcon;
