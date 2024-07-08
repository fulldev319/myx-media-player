import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={15} cy={15} r={15} fill="#FA347C" />
    <Path
      d="M11.5434 16.1128C12.2901 16.1128 12.8954 15.5249 12.8954 14.7998C12.8954 14.0747 12.2901 13.4868 11.5434 13.4868C10.7967 13.4868 10.1914 14.0747 10.1914 14.7998C10.1914 15.5249 10.7967 16.1128 11.5434 16.1128Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.0957 11.5498C18.8209 11.5498 19.4087 10.962 19.4087 10.2368C19.4087 9.51168 18.8209 8.92383 18.0957 8.92383C17.3706 8.92383 16.7827 9.51168 16.7827 10.2368C16.7827 10.962 17.3706 11.5498 18.0957 11.5498Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.0957 20.6758C18.8209 20.6758 19.4087 20.0879 19.4087 19.3628C19.4087 18.6377 18.8209 18.0498 18.0957 18.0498C17.3706 18.0498 16.7827 18.6377 16.7827 19.3628C16.7827 20.0879 17.3706 20.6758 18.0957 20.6758Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.9995 13.786L16.6395 11.251"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.6395 18.349L12.9995 15.814"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
