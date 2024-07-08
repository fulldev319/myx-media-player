import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  apiPostCountryFollow,
  apiPostCountryUnFollow,
} from 'helper/fictionHelper';
import {EnlIcon} from '../assets/svgs';

interface PostCountry {
  country: number;
  image: string;
  name: string;
  posts: number;
  isFollowing: number;
}
interface PostCountryProps {
  data: PostCountry;
  onPress: (country: any) => void;
}

const PostCountry = (props: PostCountryProps) => {
  const {data, onPress} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(!!data.isFollowing);

  const onFollow = async () => {
    setIsLoading(true);
    if (!isFollowing) {
      await followPostingCountry();
    } else {
      await unFollowPostingCountry();
    }
    setIsLoading(false);
  };

  const followPostingCountry = async () => {
    const params = {country: data.country};
    const res = await apiPostCountryFollow(params);
    if (res.success) {
      setIsFollowing(true);
    }
  };

  const unFollowPostingCountry = async () => {
    const params = {country: data.country};
    const res = await apiPostCountryUnFollow(params);
    if (res.success) {
      setIsFollowing(false);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageWrap}>
        <Image
          source={{uri: data.image}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
      <Text style={styles.countryName}>{data.name}</Text>
      <Text style={styles.postCount}>{data.posts} posts</Text>
      <TouchableOpacity onPress={onFollow} style={styles.followBtn}>
        {!isLoading ? (
          <Text style={styles.followTxt}>
            {!isFollowing ? 'Follow' : 'Unfollow'}
          </Text>
        ) : (
          <ActivityIndicator color={'#bf76f9'} size="small" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default PostCountry;

const styles = StyleSheet.create({
  container: {
    width: 130,
    borderRadius: 16,
    backgroundColor: '#25272d',
    padding: 12,
    marginRight: 8,
  },
  countryName: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 10,
    color: 'white',
    opacity: 0.6,
    marginTop: 8,
  },
  postCount: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  followBtn: {
    marginTop: 8,
  },
  followTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: '#bf76f9',
  },
  imageWrap: {
    width: 24,
    height: 24,
    backgroundColor: 'grey',
    borderRadius: 24,
    overflow: 'hidden',
  },
});
