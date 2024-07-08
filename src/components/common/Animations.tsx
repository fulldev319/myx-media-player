import {StackNavigationOptions} from '@react-navigation/stack';

export const verticalAnimation: StackNavigationOptions = {
  gestureDirection: 'vertical',
  headerShown: false,
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};
