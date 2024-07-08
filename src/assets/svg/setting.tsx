import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = ({isActive, ...props}) => (
  <Svg
    width={23}
    height={23}
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M20.2 11.388C20.2008 10.8463 20.3656 10.3174 20.6728 9.87118C20.98 9.42492 21.4152 9.08217 21.921 8.88804C21.6592 7.79313 21.2251 6.74677 20.635 5.78804C20.2913 5.94031 19.9198 6.01965 19.544 6.02104C19.0974 6.02179 18.6577 5.91075 18.2649 5.69803C17.8722 5.48532 17.539 5.17769 17.2957 4.8032C17.0523 4.42871 16.9065 3.99927 16.8717 3.55401C16.8368 3.10876 16.9139 2.66186 17.096 2.25404C16.1394 1.6637 15.095 1.22928 14.002 0.967041C13.807 1.47176 13.4639 1.90566 13.0177 2.21166C12.5714 2.51766 12.043 2.68143 11.502 2.68143C10.9609 2.68143 10.4325 2.51766 9.9863 2.21166C9.54008 1.90566 9.19693 1.47176 9.00198 0.967041C7.90707 1.22887 6.8607 1.66294 5.90198 2.25304C6.08417 2.66109 6.16127 3.10826 6.12625 3.55376C6.09123 3.99926 5.9452 4.4289 5.70149 4.80347C5.45778 5.17803 5.12414 5.4856 4.73103 5.69811C4.33792 5.91062 3.89785 6.02129 3.45098 6.02004C3.07483 6.02132 2.70279 5.94186 2.35998 5.78704C1.7751 6.74784 1.34295 7.79363 1.07898 8.88704C1.58349 9.08188 2.01727 9.42475 2.32337 9.87062C2.62947 10.3165 2.79356 10.8445 2.7941 11.3853C2.79464 11.9262 2.63161 12.4545 2.3264 12.901C2.0212 13.3475 1.5881 13.6912 1.08398 13.887C1.3458 14.9819 1.77988 16.0283 2.36998 16.987C2.86437 16.7675 3.41367 16.7029 3.9455 16.8018C4.47732 16.9006 4.96673 17.1583 5.34923 17.5408C5.73173 17.9233 5.98937 18.4127 6.08822 18.9445C6.18707 19.4763 6.12249 20.0256 5.90298 20.52C6.86218 21.1092 7.9084 21.5432 9.00298 21.806C9.19715 21.3015 9.53963 20.8676 9.98529 20.5616C10.431 20.2556 10.9589 20.0918 11.4995 20.0918C12.0401 20.0918 12.568 20.2556 13.0137 20.5616C13.4593 20.8676 13.8018 21.3015 13.996 21.806C15.0909 21.5442 16.1373 21.1101 17.096 20.52C16.8782 20.0257 16.8149 19.477 16.9144 18.946C17.0139 18.4151 17.2715 17.9265 17.6535 17.5446C18.0355 17.1626 18.524 16.9049 19.055 16.8054C19.586 16.706 20.1346 16.7693 20.629 16.987C21.2181 16.0278 21.6522 14.9816 21.915 13.887C21.4119 13.6899 20.9795 13.3464 20.6738 12.9009C20.368 12.4554 20.203 11.9284 20.2 11.388V11.388ZM11.549 15.725C10.6902 15.725 9.85073 15.4704 9.13669 14.9933C8.42266 14.5162 7.86613 13.838 7.53749 13.0447C7.20886 12.2513 7.12287 11.3782 7.29041 10.536C7.45795 9.69369 7.87148 8.92002 8.47872 8.31278C9.08596 7.70554 9.85963 7.29201 10.7019 7.12447C11.5442 6.95693 12.4172 7.04292 13.2106 7.37156C14.004 7.70019 14.6821 8.25672 15.1592 8.97075C15.6363 9.68479 15.891 10.5243 15.891 11.383C15.8911 11.9533 15.7789 12.518 15.5607 13.0448C15.3426 13.5717 15.0227 14.0504 14.6195 14.4536C14.2163 14.8568 13.7376 15.1766 13.2107 15.3948C12.6839 15.613 12.1192 15.7252 11.549 15.725V15.725Z"
      stroke={isActive ? '#f6943d' : '#A7A7A7' }
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgComponent;