import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';

const ScaledImage = ({
  uri,
  width,
  height,
  style,
  minHeight,
}: {
  uri: string;
  width?: number;
  height?: number;
  minHeight?: number;
  style?: any;
}) => {
  const [imageWidth, setImageWidth] = useState(width);
  const [imageHeight, setImageHeight] = useState(height);
  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      if (width && !height) {
        setImageWidth(width);
        const newHeight = h * (width / w);
        setImageHeight(minHeight ? Math.max(minHeight, newHeight) : newHeight);
      } else if (!width && height) {
        setImageWidth(w * (height / h));
        setImageHeight(height);
      }
    });
  });

  return (
    <Image
      source={{uri}}
      resizeMode="cover"
      style={{height: imageHeight, width: imageWidth, ...style}}
    />
  );
};

export default ScaledImage;
