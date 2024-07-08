import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const BookMarkSelIcon = props => (
  <Svg
    width={57}
    height={58}
    viewBox="0 0 57 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0 0H57V58H40C21.1438 58 11.7157 58 5.85786 52.1421C0 46.2843 0 36.8562 0 18V0Z"
      fill="#010101"
      fillOpacity={0.79}
    />
    <Path
      d="M20 24.5C20 23.1022 20 22.4033 20.2284 21.8519C20.5328 21.1169 21.1169 20.5328 21.8519 20.2284C22.4033 20 23.1022 20 24.5 20H31.5C32.8978 20 33.5967 20 34.1481 20.2284C34.8831 20.5328 35.4672 21.1169 35.7716 21.8519C36 22.4033 36 23.1022 36 24.5V36.6943C36 37.6251 36 38.0905 35.8406 38.3379C35.6281 38.6677 35.2423 38.8428 34.8541 38.7855C34.563 38.7426 34.2127 38.4361 33.5122 37.8232L28.9878 33.8643C28.6771 33.5925 28.5218 33.4566 28.3517 33.3927C28.125 33.3075 27.875 33.3075 27.6483 33.3927C27.4782 33.4566 27.3229 33.5925 27.0122 33.8643L22.4878 37.8232C21.7873 38.4361 21.437 38.7426 21.1459 38.7855C20.7577 38.8428 20.3719 38.6677 20.1594 38.3379C20 38.0905 20 37.6251 20 36.6943V24.5Z"
      fill="white"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.4734 19.25H31.5266C32.203 19.25 32.7485 19.25 33.1925 19.2803C33.6491 19.3114 34.0528 19.3771 34.4351 19.5355C35.3539 19.9161 36.0839 20.6461 36.4646 21.5649C36.6229 21.9472 36.6886 22.3509 36.7197 22.8075C36.75 23.2515 36.75 23.797 36.75 24.4734V36.7241C36.75 37.1641 36.75 37.5368 36.7279 37.8289C36.7066 38.1119 36.6587 38.4529 36.4711 38.7441C36.0991 39.3213 35.424 39.6277 34.7447 39.5275C34.4019 39.477 34.1138 39.2884 33.8867 39.1182C33.6524 38.9424 33.3719 38.697 33.0407 38.4072L28.4939 34.4287C28.3314 34.2865 28.2357 34.2033 28.1603 34.1454C28.1137 34.1096 28.0917 34.097 28.0858 34.094C28.0304 34.0737 27.9696 34.0737 27.9142 34.094C27.9083 34.097 27.8863 34.1096 27.8397 34.1454C27.7643 34.2033 27.6686 34.2865 27.5061 34.4287L22.9592 38.4073C22.6281 38.697 22.3476 38.9424 22.1133 39.1182C21.8862 39.2884 21.5981 39.477 21.2553 39.5275C20.576 39.6277 19.9009 39.3213 19.529 38.7441C19.3413 38.4529 19.2934 38.1119 19.2721 37.8289C19.25 37.5368 19.25 37.1641 19.25 36.7241L19.25 24.4734C19.25 23.797 19.25 23.2515 19.2803 22.8075C19.3114 22.3509 19.3771 21.9472 19.5355 21.5649C19.9161 20.6461 20.6461 19.9161 21.5649 19.5355C21.9472 19.3771 22.3509 19.3114 22.8075 19.2803C23.2515 19.25 23.797 19.25 24.4734 19.25ZM28.0842 34.0932C28.0842 34.0932 28.0851 34.0936 28.0858 34.094L28.0842 34.0932ZM22.9096 20.7768C22.5294 20.8027 22.308 20.8513 22.139 20.9213C21.5877 21.1496 21.1496 21.5876 20.9213 22.139C20.8513 22.308 20.8027 22.5294 20.7768 22.9096C20.7504 23.2965 20.75 23.7908 20.75 24.5V36.6943C20.75 37.1721 20.7505 37.4873 20.7678 37.7159C20.7791 37.8656 20.7955 37.9293 20.7999 37.9461C20.8511 38.0145 20.9338 38.052 21.0189 38.0455C21.0345 38.0378 21.0933 38.0081 21.2134 37.9181C21.3968 37.7806 21.6343 37.5734 21.9939 37.2588L26.5184 33.2999C26.5394 33.2815 26.5604 33.2629 26.5816 33.2443C26.8249 33.0303 27.0817 32.8044 27.3845 32.6906C27.7813 32.5415 28.2187 32.5415 28.6155 32.6906C28.9183 32.8044 29.1751 33.0303 29.4184 33.2443C29.4396 33.2629 29.4606 33.2815 29.4816 33.2999L34.0061 37.2588C34.3657 37.5734 34.6032 37.7806 34.7866 37.9181C34.9067 38.0081 34.9655 38.0378 34.9811 38.0455C35.0662 38.052 35.1489 38.0145 35.2001 37.9461C35.2045 37.9293 35.2209 37.8656 35.2322 37.7159C35.2495 37.4873 35.25 37.1721 35.25 36.6943V24.5C35.25 23.7908 35.2496 23.2965 35.2232 22.9096C35.1973 22.5294 35.1487 22.308 35.0787 22.139C34.8504 21.5876 34.4124 21.1496 33.861 20.9213C33.692 20.8513 33.4706 20.8027 33.0904 20.7768C32.7035 20.7504 32.2092 20.75 31.5 20.75H24.5C23.7908 20.75 23.2965 20.7504 22.9096 20.7768Z"
      fill="white"
    />
  </Svg>
);

export const BookMarkIcon = props => (
  <Svg
    width={57}
    height={58}
    viewBox="0 0 57 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0 0H57V58H40C21.1438 58 11.7157 58 5.85786 52.1421C0 46.2843 0 36.8562 0 18V0Z"
      fill="#010101"
      fillOpacity={0.79}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.4734 19.25H31.5266C32.203 19.25 32.7485 19.25 33.1925 19.2803C33.6491 19.3114 34.0528 19.3771 34.4351 19.5355C35.3539 19.9161 36.0839 20.6461 36.4646 21.5649C36.6229 21.9472 36.6886 22.3509 36.7197 22.8075C36.75 23.2515 36.75 23.797 36.75 24.4734V36.7241C36.75 37.1641 36.75 37.5368 36.7279 37.8289C36.7066 38.1119 36.6587 38.4529 36.4711 38.7441C36.0991 39.3213 35.424 39.6277 34.7447 39.5275C34.4019 39.477 34.1138 39.2884 33.8867 39.1182C33.6524 38.9424 33.3719 38.697 33.0407 38.4072L28.4939 34.4287C28.3314 34.2865 28.2357 34.2033 28.1603 34.1454C28.1137 34.1096 28.0917 34.097 28.0858 34.094C28.0304 34.0737 27.9696 34.0737 27.9142 34.094C27.9083 34.097 27.8863 34.1096 27.8397 34.1454C27.7643 34.2033 27.6686 34.2865 27.5061 34.4287L22.9592 38.4073C22.6281 38.697 22.3476 38.9424 22.1133 39.1182C21.8862 39.2884 21.5981 39.477 21.2553 39.5275C20.576 39.6277 19.9009 39.3213 19.529 38.7441C19.3413 38.4529 19.2934 38.1119 19.2721 37.8289C19.25 37.5368 19.25 37.1641 19.25 36.7241L19.25 24.4734C19.25 23.797 19.25 23.2515 19.2803 22.8075C19.3114 22.3509 19.3771 21.9472 19.5355 21.5649C19.9161 20.6461 20.6461 19.9161 21.5649 19.5355C21.9472 19.3771 22.3509 19.3114 22.8075 19.2803C23.2515 19.25 23.797 19.25 24.4734 19.25ZM28.0842 34.0932C28.0842 34.0932 28.0851 34.0936 28.0858 34.094L28.0842 34.0932ZM22.9096 20.7768C22.5294 20.8027 22.308 20.8513 22.139 20.9213C21.5877 21.1496 21.1496 21.5876 20.9213 22.139C20.8513 22.308 20.8027 22.5294 20.7768 22.9096C20.7504 23.2965 20.75 23.7908 20.75 24.5V36.6943C20.75 37.1721 20.7505 37.4873 20.7678 37.7159C20.7791 37.8656 20.7955 37.9293 20.7999 37.9461C20.8511 38.0145 20.9338 38.052 21.0189 38.0455C21.0345 38.0378 21.0933 38.0081 21.2134 37.9181C21.3968 37.7806 21.6343 37.5734 21.9939 37.2588L26.5184 33.2999C26.5394 33.2815 26.5604 33.2629 26.5816 33.2443C26.8249 33.0303 27.0817 32.8044 27.3845 32.6906C27.7813 32.5415 28.2187 32.5415 28.6155 32.6906C28.9183 32.8044 29.1751 33.0303 29.4184 33.2443C29.4396 33.2629 29.4606 33.2815 29.4816 33.2999L34.0061 37.2588C34.3657 37.5734 34.6032 37.7806 34.7866 37.9181C34.9067 38.0081 34.9655 38.0378 34.9811 38.0455C35.0662 38.052 35.1489 38.0145 35.2001 37.9461C35.2045 37.9293 35.2209 37.8656 35.2322 37.7159C35.2495 37.4873 35.25 37.1721 35.25 36.6943V24.5C35.25 23.7908 35.2496 23.2965 35.2232 22.9096C35.1973 22.5294 35.1487 22.308 35.0787 22.139C34.8504 21.5876 34.4124 21.1496 33.861 20.9213C33.692 20.8513 33.4706 20.8027 33.0904 20.7768C32.7035 20.7504 32.2092 20.75 31.5 20.75H24.5C23.7908 20.75 23.2965 20.7504 22.9096 20.7768Z"
      fill="white"
    />
  </Svg>
);

export const PlayPrevIcon = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M15.1797 5.41517V12.5927C15.1797 14.0627 13.5822 14.9852 12.3072 14.2502L9.19473 12.4577L6.08223 10.6577C4.80723 9.92266 4.80723 8.08517 6.08223 7.35017L9.19473 5.55017L12.3072 3.75767C13.5822 3.02267 15.1797 3.93767 15.1797 5.41517Z"
      fill="white"
    />
    <Path
      d="M2.82031 14.1977C2.51281 14.1977 2.25781 13.9427 2.25781 13.6352V4.36523C2.25781 4.05773 2.51281 3.80273 2.82031 3.80273C3.12781 3.80273 3.38281 4.05773 3.38281 4.36523V13.6352C3.38281 13.9427 3.12781 14.1977 2.82031 14.1977Z"
      fill="white"
    />
  </Svg>
);

export const PlayNextIcon = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M2.82031 5.41517V12.5927C2.82031 14.0627 4.41781 14.9852 5.69281 14.2502L8.80531 12.4577L11.9178 10.6577C13.1928 9.92266 13.1928 8.08517 11.9178 7.35017L8.80531 5.55017L5.69281 3.75767C4.41781 3.02267 2.82031 3.93767 2.82031 5.41517Z"
      fill="white"
    />
    <Path
      d="M15.1797 14.1977C14.8722 14.1977 14.6172 13.9427 14.6172 13.6352V4.36523C14.6172 4.05773 14.8722 3.80273 15.1797 3.80273C15.4872 3.80273 15.7422 4.05773 15.7422 4.36523V13.6352C15.7422 13.9427 15.4947 14.1977 15.1797 14.1977Z"
      fill="white"
    />
  </Svg>
);

export const PlayIcon = props => (
  <Svg
    width={11}
    height={12}
    viewBox="0 0 11 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0.820312 2.41517V9.59266C0.820312 11.0627 2.41781 11.9852 3.69281 11.2502L6.80531 9.45766L9.91781 7.65766C11.1928 6.92266 11.1928 5.08517 9.91781 4.35017L6.80531 2.55017L3.69281 0.757666C2.41781 0.0226661 0.820312 0.937666 0.820312 2.41517Z"
      fill="white"
    />
  </Svg>
);

export const PauseIcon = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.97754 1.5C4.83754 1.5 1.47754 4.86 1.47754 9C1.47754 13.14 4.83754 16.5 8.97754 16.5C13.1175 16.5 16.4775 13.14 16.4775 9C16.4775 4.86 13.125 1.5 8.97754 1.5ZM8.04004 11.2725C8.04004 11.6325 7.89004 11.775 7.50754 11.775H6.53254C6.15004 11.775 6.00004 11.6325 6.00004 11.2725V6.7275C6.00004 6.3675 6.15004 6.225 6.53254 6.225H7.50004C7.88254 6.225 8.03254 6.3675 8.03254 6.7275V11.2725H8.04004ZM12 11.2725C12 11.6325 11.85 11.775 11.4675 11.775H10.5C10.1175 11.775 9.96754 11.6325 9.96754 11.2725V6.7275C9.96754 6.3675 10.1175 6.225 10.5 6.225H11.4675C11.85 6.225 12 6.3675 12 6.7275V11.2725Z"
      fill="white"
    />
  </Svg>
);

export const LikeIcon = props => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.33301 1.5C2.84126 1.5 0.833008 3.54604 0.833008 6.05542C0.833008 8.43832 2.08885 11.9951 6.73577 14.1743L6.75586 14.1837C7.00851 14.3022 7.18703 14.386 7.45593 14.4459C7.76461 14.5147 8.23474 14.5147 8.54342 14.4459C8.81232 14.386 8.99084 14.3022 9.24349 14.1837L9.26357 14.1743C13.9105 11.9951 15.1663 8.43832 15.1663 6.05542C15.1663 3.54604 13.1581 1.5 10.6663 1.5C9.66795 1.5 8.74539 1.82958 7.99968 2.38569C7.25396 1.82958 6.3314 1.5 5.33301 1.5Z"
      fill="#FF3F3F"
    />
  </Svg>
);

export const MessageIcon = props => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 9.43397 3.04812 10.7388 3.94715 11.7182C4.07404 11.8564 4.11285 12.054 4.04767 12.23L3.61928 13.3864L5.1388 12.883C5.26512 12.8411 5.40292 12.8514 5.52167 12.9114C6.26586 13.2878 7.10742 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C7.02216 14.5 6.09357 14.2837 5.26055 13.8961L2.9463 14.6628C2.76385 14.7232 2.56291 14.6738 2.4294 14.5355C2.29588 14.3973 2.25343 14.1947 2.32019 14.0145L3.00663 12.1615C2.0663 11.0343 1.5 9.58279 1.5 8Z"
      fill="white"
    />
    <Path
      d="M6.00033 7.99992C6.00033 8.36811 5.70185 8.66659 5.33366 8.66659C4.96547 8.66659 4.66699 8.36811 4.66699 7.99992C4.66699 7.63173 4.96547 7.33325 5.33366 7.33325C5.70185 7.33325 6.00033 7.63173 6.00033 7.99992Z"
      fill="white"
    />
    <Path
      d="M8.66732 7.99992C8.66732 8.36811 8.36884 8.66659 8.00065 8.66659C7.63246 8.66659 7.33398 8.36811 7.33398 7.99992C7.33398 7.63173 7.63246 7.33325 8.00065 7.33325C8.36884 7.33325 8.66732 7.63173 8.66732 7.99992Z"
      fill="white"
    />
    <Path
      d="M11.3333 7.99992C11.3333 8.36811 11.0349 8.66659 10.6667 8.66659C10.2985 8.66659 10 8.36811 10 7.99992C10 7.63173 10.2985 7.33325 10.6667 7.33325C11.0349 7.33325 11.3333 7.63173 11.3333 7.99992Z"
      fill="white"
    />
  </Svg>
);

export const FollowIcon = props => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.0243 2.72544C13.918 2.31529 13.5977 1.995 13.1875 1.88872C12.986 1.83649 12.7871 1.8626 12.6203 1.89668C12.4541 1.93066 12.2506 1.9888 12.0157 2.05592L2.7464 4.7043C2.45018 4.78893 2.20077 4.86018 2.01049 4.9303C1.82801 4.99755 1.61034 5.09333 1.45583 5.27306C1.15189 5.6266 1.08762 6.12715 1.29238 6.546C1.39647 6.75893 1.58288 6.9066 1.74245 7.01777C1.90884 7.13368 2.13215 7.26563 2.39737 7.42235L5.67396 9.35852C5.9043 9.49462 5.98241 9.54183 6.0514 9.59532C6.15098 9.67254 6.24043 9.76199 6.31765 9.86158C6.37114 9.93056 6.41835 10.0087 6.55446 10.239L8.49063 13.5156C8.64733 13.7808 8.7793 14.0041 8.8952 14.1705C9.00637 14.3301 9.15404 14.5165 9.36697 14.6206C9.78583 14.8253 10.2864 14.7611 10.6399 14.4571C10.8196 14.3026 10.9154 14.085 10.9827 13.9025C11.0528 13.7122 11.124 13.4628 11.2087 13.1666L13.857 3.89725C13.9242 3.66236 13.9823 3.4589 14.0163 3.29267C14.0504 3.1259 14.0765 2.927 14.0243 2.72544ZM12.8206 2.87643C12.8996 2.86027 12.9352 2.85913 12.9447 2.85903C12.9968 2.87533 13.0376 2.91618 13.0539 2.96828C13.0538 2.97778 13.0527 3.01334 13.0365 3.09241C13.0112 3.21634 12.9641 3.38239 12.8903 3.64078L10.2526 12.8727C10.1611 13.1932 10.0999 13.4059 10.0444 13.5567C10.0077 13.6563 9.98419 13.6963 9.978 13.7068C9.93176 13.7408 9.87117 13.7485 9.81785 13.7274C9.8092 13.7188 9.7764 13.686 9.71572 13.5989C9.62388 13.4671 9.51096 13.2766 9.3414 12.9897L7.40043 9.70496C7.33001 9.58576 7.27278 9.48888 7.21693 9.40314L9.50508 7.11499C9.70034 6.91973 9.70034 6.60314 9.50508 6.40788C9.30981 6.21262 8.99323 6.21262 8.79797 6.40788L6.50982 8.69603C6.42408 8.64018 6.3272 8.58295 6.20801 8.51254L2.92328 6.57157C2.63633 6.40201 2.4459 6.28909 2.31407 6.19725C2.22697 6.13657 2.19419 6.10377 2.18561 6.09512C2.16442 6.0418 2.1722 5.98121 2.20617 5.93498C2.21666 5.92878 2.25667 5.90532 2.35627 5.86862C2.50703 5.81306 2.7198 5.75191 3.04028 5.66035L12.2722 3.02266C12.5306 2.94883 12.6966 2.90176 12.8206 2.87643Z"
      fill="white"
    />
  </Svg>
);