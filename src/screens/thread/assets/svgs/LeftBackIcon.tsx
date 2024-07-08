import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={26}
      height={24}
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.889 12.8l5.96 5.6c.419.4 1.046.4 1.464 0 .419-.4.419-1 0-1.4l-5.124-5 5.124-5c.419-.4.419-1 0-1.4a.97.97 0 00-.732-.3.97.97 0 00-.732.3l-5.96 5.6c-.419.5-.419 1.1 0 1.6 0-.1 0-.1 0 0z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
