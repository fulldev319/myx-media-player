import React from 'react';
import {View} from 'react-native';
import * as Progress from 'react-native-progress';

import {styles} from './index.styles';

const LoadingBar = () => {
  return (
    <View style={styles.loadingContainer}>
      <Progress.Circle
        size={80}
        indeterminate={true}
        borderWidth={5}
        color={'rgba(255, 102, 81, 1)'}
        thickness={20}
      />
    </View>
  );
};

export default LoadingBar;
