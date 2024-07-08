import {useNavigation} from '@react-navigation/native';
import {timeSince} from 'helper/utils';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
const dayjs = require('dayjs');
import {styles} from './index.styles';

export const ActivityCard = ({userId, data, navigation}) => {
  const type = data.type;
  const agoTime = timeSince(data.createdAt) + ' ago';

  const goToProfile = personId => {
    navigation.navigate('OtherProfilePage', {userId: personId});
  };

  const goToPlaylist = playlistId => {
    navigation.navigate('TrackPlayListPage', {playlistId: playlistId});
  };

  const openTrackPlayer = trackId => {};

  if (type == 1) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => goToProfile(data.owner)}>
        <View style={styles.mainBody}>
          <View>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <View style={styles.txtDesc}>
              <TouchableOpacity onPress={() => goToProfile(data.owner)}>
                <Text style={styles.highlightDesc}>{data.linkInfos[0]}</Text>
              </TouchableOpacity>
              <Text style={styles.normalDesc}>started following</Text>
              <TouchableOpacity
                onPress={() =>
                  userId !== data.owner && goToProfile(data.owner)
                }>
                <Text style={styles.highlightDesc}>
                  {userId === data.owner ? 'you' : data.linkInfos[1]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Image source={{uri: data.image}} style={styles.image} />
          </View>
        </View>
        <View style={styles.actionBtnContainer}>
          <AcitivityActionButton type={0} text={'Follow Back'} />
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 5) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <View style={[styles.txtDesc]}>
              <TouchableOpacity onPress={() => goToProfile(data.owner)}>
                <Text style={styles.highlightDesc}>{data.linkInfos[0]}</Text>
              </TouchableOpacity>
              <Text
                style={[styles.normalDesc, {marginTop: -2.5, marginEnd: 50}]}>
                just posted a new memory 💫
              </Text>
            </View>
          </View>
          <Image source={{uri: data.image}} style={styles.image} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 6) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          openTrackPlayer('');
        }}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              <Text style={[styles.normalDesc]}>
                just saved a new track - give it a listen 🎵
              </Text>
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 7) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              {userId === data.owner ? (
                <Text style={[styles.normalDesc]}>liked your memory</Text>
              ) : (
                <Text>
                  <Text style={[styles.normalDesc]}>liked </Text>
                  <Text
                    style={styles.highlightDesc}
                    onPress={() => goToProfile(data.links[1])}>
                    {data.linkInfos[1]}
                  </Text>
                  <Text style={[styles.normalDesc]}> 's memory</Text>
                </Text>
              )}
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 8) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              {userId === data.owner ? (
                <Text style={[styles.normalDesc]}>
                  commented on your memory
                </Text>
              ) : (
                <Text>
                  <Text style={[styles.normalDesc]}>commented on </Text>
                  <Text style={styles.highlightDesc} onPress={() => {}}>
                    {data.linkInfos[1]}
                  </Text>
                </Text>
              )}
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 9) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              {userId === data.owner ? (
                <Text style={[styles.normalDesc]}>
                  accepted your memory tag
                </Text>
              ) : (
                <Text>
                  <Text style={[styles.normalDesc]}>
                    was just tagged in a new memory - check it out!{' '}
                  </Text>
                </Text>
              )}
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 10) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              {userId === data.owner && (
                <Text
                  style={styles.highlightDesc}
                  onPress={() => goToProfile(data.owner)}>
                  {data.linkInfos[0] + ' '}
                </Text>
              )}
              {userId === data.owner ? (
                <Text style={[styles.normalDesc]}>declined your tag</Text>
              ) : (
                <Text
                  style={styles.highlightDesc}
                  onPress={() => goToProfile(data.links[1])}>
                  SKIP!!!!
                </Text>
              )}
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 11) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              <Text style={[styles.normalDesc]}>
                just created a new memory album,{' '}
              </Text>
              <Text style={styles.highlightDesc} onPress={() => {}}>
                {data.linkInfos[1]}
              </Text>
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.image} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 12) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => goToPlaylist(data.mainLink)}>
        <View style={styles.mainBody}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              <Text style={[styles.normalDesc]}>
                just created a new playlist,{' '}
              </Text>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToPlaylist(data.links[1])}>
                {data.linkInfos[1]}
              </Text>
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.image} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else if (type === 13) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => goToPlaylist(data.mainLink)}>
        <View style={styles.mainBody}>
          <View>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <Text style={[styles.txtDesc, {marginEnd: 10}]}>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToProfile(data.owner)}>
                {data.linkInfos[0] + ' '}
              </Text>
              <Text style={[styles.normalDesc]}>saved a new playlist, </Text>
              <Text
                style={styles.highlightDesc}
                onPress={() => goToPlaylist(data.links[1])}>
                {data.linkInfos[1]}
              </Text>
            </Text>
          </View>
          <Image source={{uri: data.image}} style={styles.trackImage} />
        </View>
        <View style={styles.actionBtnContainer}></View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.mainBody}>
          <View>
            <View>
              <Text style={styles.txtAgo}>{agoTime}</Text>
            </View>
            <View style={styles.txtDesc}>
              <Text style={styles.highlightDesc}>@meganchoi</Text>
              <Text style={styles.normalDesc}>just followed</Text>
              <Text style={styles.highlightDesc}>@artieskull</Text>
            </View>
          </View>
          <View>
            <Image
              source={{uri: 'https://i.pravatar.cc/150?img=53'}}
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }
};

const AcitivityActionButton = ({type, text, onPressed = null}) => {
  return (
    <TouchableOpacity
      onPress={() => onPressed && onPressed()}
      style={type == 0 ? styles.redActionBtn : styles.blackActionBtn}>
      <Text style={styles.actionBtnText}>{text}</Text>
    </TouchableOpacity>
  );
};
