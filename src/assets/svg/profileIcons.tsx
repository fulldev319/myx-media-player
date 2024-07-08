import * as React from 'react';
import Svg, {Circle, ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

export const MemoriesTabIcon = ({isSel}) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G opacity={isSel ? 1 : 0.4}>
      <Path
        d="M9.20833 2.5H3.375V8.33333H9.20833V2.5Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.375 2.5H12.5416V8.33333H18.375V2.5Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.375 11.6667H12.5416V17.5001H18.375V11.6667Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.20833 11.6667H3.375V17.5001H9.20833V11.6667Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const TaggedTabIcon = ({isSel}) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G opacity={isSel ? 1 : 0.4}>
      <Path
        d="M17.7833 11.1751L11.8083 17.1501C11.6535 17.305 11.4697 17.428 11.2674 17.5118C11.065 17.5957 10.8482 17.6389 10.6291 17.6389C10.4101 17.6389 10.1932 17.5957 9.99089 17.5118C9.78856 17.428 9.60475 17.305 9.44996 17.1501L2.29163 10.0001V1.66675H10.625L17.7833 8.82508C18.0937 9.13735 18.2679 9.55977 18.2679 10.0001C18.2679 10.4404 18.0937 10.8628 17.7833 11.1751V11.1751Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.45837 5.83325H6.46671"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const SavedTabIcon = ({isSel}) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G opacity={isSel ? 1 : 0.4}>
      <Path
        d="M16.2083 17.5L10.375 13.3333L4.54163 17.5V4.16667C4.54163 3.72464 4.71722 3.30072 5.02978 2.98816C5.34234 2.67559 5.76627 2.5 6.20829 2.5H14.5416C14.9837 2.5 15.4076 2.67559 15.7201 2.98816C16.0327 3.30072 16.2083 3.72464 16.2083 4.16667V17.5Z"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const ActivityTabIcon = ({isSel}) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G opacity={isSel ? 1 : 0.4}>
      <Path
        d="M18.4583 10H15.125L12.625 17.5L7.62496 2.5L5.12496 10H1.79163"
        stroke={isSel ? '#FF6651' : 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const BackIcon = props => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071L13.6569 23.0711C14.0474 23.4616 14.6805 23.4616 15.0711 23.0711C15.4616 22.6805 15.4616 22.0474 15.0711 21.6569L9.41421 16L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L7.29289 15.2929ZM24 15H8V17H24V15Z"
      fill="white"
    />
    <Rect x={0.5} y={0.5} width={31} height={31} rx={15.5} stroke="white" />
  </Svg>
);

export const CameraIcon = ({withRect = true}) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    {withRect && <Rect width={32} height={32} rx={16} fill="#FF6651" />}
    <G clipPath="url(#clip0_12495_7432)">
      <Path
        d="M23.3332 20.6667C23.3332 21.0203 23.1927 21.3594 22.9426 21.6095C22.6926 21.8595 22.3535 22 21.9998 22H9.99984C9.64622 22 9.30708 21.8595 9.05703 21.6095C8.80698 21.3594 8.6665 21.0203 8.6665 20.6667V13.3333C8.6665 12.9797 8.80698 12.6406 9.05703 12.3905C9.30708 12.1405 9.64622 12 9.99984 12H12.6665L13.9998 10H17.9998L19.3332 12H21.9998C22.3535 12 22.6926 12.1405 22.9426 12.3905C23.1927 12.6406 23.3332 12.9797 23.3332 13.3333V20.6667Z"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.0002 19.3333C17.4729 19.3333 18.6668 18.1394 18.6668 16.6667C18.6668 15.1939 17.4729 14 16.0002 14C14.5274 14 13.3335 15.1939 13.3335 16.6667C13.3335 18.1394 14.5274 19.3333 16.0002 19.3333Z"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_12495_7432">
        <Rect width={16} height={16} fill="white" transform="translate(8 8)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const LockIcon = props => (
  <Svg
    width={100}
    height={100}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={50} cy={50} r={49.5} stroke="white" strokeOpacity={0.6} />
    <G opacity={0.6}>
      <Path
        d="M61.6667 48.3334H38.3333C36.4924 48.3334 35 49.8258 35 51.6667V63.3334C35 65.1743 36.4924 66.6667 38.3333 66.6667H61.6667C63.5076 66.6667 65 65.1743 65 63.3334V51.6667C65 49.8258 63.5076 48.3334 61.6667 48.3334Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M41.6665 48.3334V41.6667C41.6665 39.4566 42.5445 37.337 44.1073 35.7742C45.6701 34.2113 47.7897 33.3334 49.9998 33.3334C52.21 33.3334 54.3296 34.2113 55.8924 35.7742C57.4552 37.337 58.3332 39.4566 58.3332 41.6667V48.3334"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export const ImageUploadIcon = props => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M26.2125 1.25H22.5375C21.45 1.25 20.65 1.7 20.2875 2.5C20.0875 2.8625 20 3.2875 20 3.7875V7.4625C20 9.05 20.95 10 22.5375 10H26.2125C26.7125 10 27.1375 9.9125 27.5 9.7125C28.3 9.35 28.75 8.55 28.75 7.4625V3.7875C28.75 2.2 27.8 1.25 26.2125 1.25ZM27.3875 6.1625C27.2625 6.2875 27.075 6.375 26.875 6.3875H25.1125V7.025L25.125 8.125C25.1125 8.3375 25.0375 8.5125 24.8875 8.6625C24.7625 8.7875 24.575 8.875 24.375 8.875C23.9625 8.875 23.625 8.5375 23.625 8.125V6.375L21.875 6.3875C21.4625 6.3875 21.125 6.0375 21.125 5.625C21.125 5.2125 21.4625 4.875 21.875 4.875L22.975 4.8875H23.625V3.1375C23.625 2.725 23.9625 2.375 24.375 2.375C24.7875 2.375 25.125 2.725 25.125 3.1375L25.1125 4.025V4.875H26.875C27.2875 4.875 27.625 5.2125 27.625 5.625C27.6125 5.8375 27.525 6.0125 27.3875 6.1625Z"
      fill="#FF6651"
    />
    <Path
      d="M11.25 12.975C12.8931 12.975 14.225 11.6431 14.225 10C14.225 8.35698 12.8931 7.02502 11.25 7.02502C9.60698 7.02502 8.27502 8.35698 8.27502 10C8.27502 11.6431 9.60698 12.975 11.25 12.975Z"
      fill="#FF6651"
    />
    <Path
      d="M26.2125 10H25.625V15.7625L25.4625 15.625C24.4875 14.7875 22.9125 14.7875 21.9375 15.625L16.7375 20.0875C15.7625 20.925 14.1875 20.925 13.2125 20.0875L12.7875 19.7375C11.9 18.9625 10.4875 18.8875 9.4875 19.5625L4.8125 22.7C4.5375 22 4.375 21.1875 4.375 20.2375V9.7625C4.375 6.2375 6.2375 4.375 9.7625 4.375H20V3.7875C20 3.2875 20.0875 2.8625 20.2875 2.5H9.7625C5.2125 2.5 2.5 5.2125 2.5 9.7625V20.2375C2.5 21.6 2.7375 22.7875 3.2 23.7875C4.275 26.1625 6.575 27.5 9.7625 27.5H20.2375C24.7875 27.5 27.5 24.7875 27.5 20.2375V9.7125C27.1375 9.9125 26.7125 10 26.2125 10Z"
      fill="#FF6651"
    />
  </Svg>
);

export const TrashIcon = props => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M17.5774 4.35829C16.2357 4.22496 14.894 4.12496 13.544 4.04996V4.04163L13.3607 2.95829C13.2357 2.19163 13.0524 1.04163 11.1024 1.04163H8.91903C6.97737 1.04163 6.79403 2.14163 6.6607 2.94996L6.4857 4.01663C5.7107 4.06663 4.9357 4.11663 4.1607 4.19163L2.4607 4.35829C2.1107 4.39163 1.8607 4.69996 1.89403 5.04163C1.92737 5.38329 2.22737 5.63329 2.57737 5.59996L4.27737 5.43329C8.64403 4.99996 13.044 5.16663 17.4607 5.60829C17.4857 5.60829 17.5024 5.60829 17.5274 5.60829C17.844 5.60829 18.119 5.36663 18.1524 5.04163C18.1774 4.69996 17.9274 4.39163 17.5774 4.35829Z"
      fill="#FF3F3F"
    />
    <Path
      d="M16.0441 6.78337C15.8441 6.57504 15.5691 6.45837 15.2857 6.45837H4.75239C4.46906 6.45837 4.18572 6.57504 3.99406 6.78337C3.80239 6.99171 3.69406 7.27504 3.71072 7.56671L4.22739 16.1167C4.31906 17.3834 4.43572 18.9667 7.34406 18.9667H12.6941C15.6024 18.9667 15.7191 17.3917 15.8107 16.1167L16.3274 7.57504C16.3441 7.27504 16.2357 6.99171 16.0441 6.78337ZM11.4024 14.7917H8.62739C8.28572 14.7917 8.00239 14.5084 8.00239 14.1667C8.00239 13.825 8.28572 13.5417 8.62739 13.5417H11.4024C11.7441 13.5417 12.0274 13.825 12.0274 14.1667C12.0274 14.5084 11.7441 14.7917 11.4024 14.7917ZM12.1024 11.4584H7.93572C7.59406 11.4584 7.31072 11.175 7.31072 10.8334C7.31072 10.4917 7.59406 10.2084 7.93572 10.2084H12.1024C12.4441 10.2084 12.7274 10.4917 12.7274 10.8334C12.7274 11.175 12.4441 11.4584 12.1024 11.4584Z"
      fill="#FF3F3F"
    />
  </Svg>
);