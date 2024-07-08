import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './index.styles';

export const LoadingOverLay = ({ title='', description='' }) => {
  const [spinValue, setSpinValue] = useState(null);
  const [animation, setAnimation] = useState(null);
  const spin = useMemo(() => spinValue ? spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  }) : '0 deg', [spinValue]);

  useEffect(() => {
    if (!spinValue){
      setSpinValue(new Animated.Value(0));
    }
  },[]);

  useEffect(() => {
    if (spinValue) {
      if (!animation) {
        const _animation = Animated.loop(
          Animated.timing(
            spinValue,
            {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true
            }
          )
        );
        setAnimation(_animation);
        _animation.start();
      } else {
        animation.start();
      }
      return () => { animation?.stop() }
    }
  }, [spinValue, animation])
  return (
    <View>
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.loadingMainContainer}>
        <Animated.Image
          style={{ transform: [{ rotate: spin }] }}
          source={require('assets/images/loading.png')} />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>{title ? animation : 'Please Wait...'}</Text>
          <Text style={styles.loadingDescription}>{description ? description : 'This will take a moment'}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};