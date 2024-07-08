import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0E0E0E",
    paddingHorizontal: 26,
    paddingVertical :10,
    overflow: 'visible', 
  },
  logo: {},
  avatar: {
    width: 48,
    height: 48,
    padding: 3,
    backgroundColor: "red",
    borderRadius: 42,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 42,
  },
});
