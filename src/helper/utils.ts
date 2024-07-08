import React, {useState, useRef, useEffect} from 'react';
import {Dimensions, Keyboard, EmitterSubscription} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Moment from 'moment';
import getIPFSURL from './ipfs/getIPFSURL';
import {Image, Video, Audio} from 'react-native-compressor';
import {decode} from 'base64-arraybuffer';
import createBuffer from 'audio-buffer-from';
import format from 'audio-format';
import uuid from 'react-native-uuid';

const multiAddr = getIPFSURL();

export const getURLfromCID = (cid: string) => {
  const patt = /:\d{4}/i;
  const host = multiAddr.replace(patt, ':8080');
  return `${host}/ipfs/${cid}`;
};

export const processSongUrl = (song: any) => {
  const songUrl = song.AnimationUrl || song.AnimationURL;
  return songUrl;
};

export const processImage = (imageUrl: string) => {
  return convertImgUrl(imageUrl);
};

export const sanitizeIfIpfsUrl = (url: string) => {
  if (!url) {
    return null;
  }
  if (url.includes('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return url;
};

export const convertImgUrl = (url: string) => {
  if (url && url.includes('=s20')) {
    url = url.replace(/[=]s20/, '=s0');
  } else if (url && url.includes('=s40')) {
    url = url.replace(/[=]s40/, '=s0');
  } else if (url && url.includes('=s60')) {
    url = url.replace(/[=]s60/, '=s0');
  } else if (url && url.includes('=s80')) {
    url = url.replace(/[=]s80/, '=s0');
  } else if (url && url.includes('=s100')) {
    url = url.replace(/[=]s100/, '=s0');
  } else if (url && url.includes('=s120')) {
    url = url.replace(/[=]s120/, '=s0');
  } else if (url && url.includes('=s140')) {
    url = url.replace(/[=]s140/, '=s0');
  } else if (url && url.includes('=s160')) {
    url = url.replace(/[=]s160/, '=s0');
  } else if (url && url.includes('=s180')) {
    url = url.replace(/[=]s180/, '=s0');
  } else if (url && url.includes('=s200')) {
    url = url.replace(/[=]s200/, '=s0');
  }
  return url;
};

export function validEmail(email: string): boolean {
  return new RegExp(
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ).test(email);
}

export const convertTimeFormat = (_seconds: number) => {
  if (_seconds !== null) {
    const seconds = Math.round(_seconds);
    if (seconds < 60) {
      return `00:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
      const minutes = (seconds / 60) ^ 0;

      return `${minutes < 10 ? '0' + minutes : minutes}:${
        seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60
      }`;
    }
  } else {
    return '';
  }
};

export const timeFormatDDMMHHMMSS = (time: string) => {
  Moment.locale('en');

  return Moment(time).format('DD MMM HH:MM:SS');
};

export const containsObject = (obj: any, list: string | any[]) => {
  var i: number;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }

  return false;
};

export const groupBy = (list: any[], keyGetter: (arg0: any) => any) => {
  const map = new Map();
  list.forEach((item: any) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export const STATUS_BAR_HEIGHT: number = getStatusBarHeight();
export const SCREEN_HEIGHT: number = Math.round(
  Dimensions.get('window').height,
);
export const SCREEN_WIDTH: number = Math.round(Dimensions.get('window').width);

/**
 * Returns if the keyboard is open / closed
 *
 * @return {bool} isOpen
 */
export function useKeyboardStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<{
    keyboardShowListener?: EmitterSubscription;
    keyboardHideListener?: EmitterSubscription;
  }>({});

  useEffect(() => {
    ref.current.keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsOpen(true),
    );
    ref.current.keyboardHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setIsOpen(false),
    );
    return () => {
      if (ref.current.keyboardShowListener) {
        ref.current.keyboardShowListener.remove();
      }
      if (ref.current.keyboardHideListener) {
        ref.current.keyboardHideListener.remove();
      }
    };
  });

  return isOpen;
}

export async function compressMedia(mediaType: string, uri: string) {
  if (mediaType === 'image') {
    const result = await Image.compress(uri, {
      maxWidth: 1080,
      maxHeight: 1920,
      quality: 0.8,
    });
    return result;
  } else if (mediaType === 'video') {
    return await Video.compress(uri, {
      maxSize: 1280,
      bitrate: 1500,
    });
  } else if (mediaType === 'audio') {
    try {
      const data = await Audio.compress(uri, {quality: 'medium'});
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const timeSince = (timeStamp: number) => {
  const currentTimeStamp = new Date();
  var seconds = Math.floor((currentTimeStamp.getTime() - timeStamp) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    const val = Math.floor(interval);
    return val + ` year` + (val > 1 ? 's' : '');
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const val = Math.floor(interval);
    return val + ` month` + (val > 1 ? 's' : '');
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const val = Math.floor(interval);
    return val + ` day` + (val > 1 ? 's' : '');
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const val = Math.floor(interval);
    return val + ` hour` + (val > 1 ? 's' : '');
  }
  interval = seconds / 60;
  if (interval > 1) {
    const val = Math.floor(interval);
    return val + ` minute` + (val > 1 ? 's' : '');
  }

  const val = Math.floor(seconds);
  if (val == 0) {
    return 'now';
  } else {
    return val + ` second` + (val > 1 ? 's' : '');
  }
};

export const sleep = (ms: number) => {
  // return new Promise(resolve => setTimeout(resolve, ms));
};

export const trimReady = base64Str => {
  const decodeString = decode(base64Str);
  const audioBuffer = createBuffer(
    decodeString,
    format.stringify({
      type: 'int32',
      endianness: 'le',
      numberOfChannels: 2,
      sampleRate: 44100,
      bitDepth: 16,
    }),
  );
  return audioBuffer;
};

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const generateComponentKey = () => {
  return uuid.v4();
};

export const getArrFromString = (str, keyWord = ';') => {
  if (str) {
    return str.split(keyWord);
  } else {
    return [];
  }
};

export const secondsToHms = (d: number) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? 'h, ' : 'h ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? 'm, ' : 'm ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : '';
  return hDisplay + mDisplay + sDisplay;
};

export function getTimeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + 's';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + 'm';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + 'h';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + 'd';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + 'month';
  } else {
    return Math.round(elapsed / msPerYear) + 'year';
  }
}
