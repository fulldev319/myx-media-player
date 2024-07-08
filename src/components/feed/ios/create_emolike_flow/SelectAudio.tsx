import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import {SearchBar} from 'components/common/SearchBar';
import {CardUploadedAudio} from '../components/CardUploadedAudio';
import {apiGetSnipAudios} from 'helper/fictionHelper';
import {useAudioPlayer} from 'contexts/AudioContext';
import {PlayingStatus} from 'contexts/TrackContext';

export const SelectAudioSheet = ({debateId, show, onContinue, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [650, 650], []);

  const {playAudioWithoutProgress, audioId, playingStatus} = useAudioPlayer();
  const [searchText, setSearchText] = useState('');
  const [selectedAudioPath, setSelectedAudioPath] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);

  const [arrAudios, setArrAudios] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      loadAudios();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const loadAudios = async (isRefresh = true) => {
    if (hasMore && !isLoading) {
      setIsLoading(true);

      const res = await apiGetSnipAudios(20, isRefresh ? 0 : lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        isRefresh
          ? setArrAudios(prev => [...prev, ...res.data])
          : setArrAudios(res.data);
      }

      setIsLoading(false);
    }
  };

  const onPlayAudio = audioData => {
    if (playingStatus !== PlayingStatus.Playing) {
      playAudioWithoutProgress(
        audioData.id,
        'https://ipfs.filebase.io/ipfs/QmU9rKYsZadZsAnceBc7pppbEDtFhsmWQJQjkkYg3QDxZ1',
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => {
            sheetRef.current?.close();
            onClose();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.txtTitle}>Select Audio</Text>
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <SearchBar
        value={searchText}
        txtPlaceholder="Search by keywords..."
        onChangedText={setSearchText}
        theme={'gray'}
        style={{backgroundColor: '#F3F4F5', height: 40, marginTop: 24}}
      />
    );
  };

  const renderUploadAudio = () => {
    return (
      <View style={styles.selectContainer}>
        <UploadIcon />
        <Text style={styles.txtUpload}>Upload your audio</Text>
      </View>
    );
  };

  const renderAudios = () => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}>
          {arrAudios.map((item, index) => (
            <CardUploadedAudio
              data={item}
              currentAudioId={audioId}
              playingStatus={playingStatus}
              selectedAudio={selectedAudio}
              onPlay={onPlayAudio}
              onSelected={setSelectedAudio}
              key={`global_snip_audio_${index}`}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      onDismiss={onClose}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          {renderHeader()}
          {renderSearchBar()}
          {renderUploadAudio()}
          {renderAudios()}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              if (selectedAudio) {
                sheetRef.current?.close();
                onClose();

                setTimeout(() => {
                  onContinue(selectedAudio);
                }, 200);
              }
            }}>
            <Text style={styles.saveBtnTxt}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
    width: 60,
    height: 2,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    paddingEnd: 24,
  },
  btnBack: {},
  txtTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  selectContainer: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 12,
    paddingEnd: 28,
  },
  txtUpload: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
  },
  saveBtn: {
    width: '100%',
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  saveBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

const BackIcon = () => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 18l-6-6 6-6"></Path>
  </Svg>
);

const UploadIcon = () => (
  <Svg width="16" height="17" fill="none" viewBox="0 0 16 17">
    <Path
      fill="#FF6651"
      d="M5.807 5.64l1.526-1.534v6.393a.667.667 0 101.334 0V4.106l1.527 1.533a.667.667 0 001.092-.217.668.668 0 00-.146-.73L8.473 2.027a.667.667 0 00-.22-.14.667.667 0 00-.506 0 .667.667 0 00-.22.14L4.86 4.693a.67.67 0 00.947.946zM14 8.5a.667.667 0 00-.666.666v4a.667.667 0 01-.667.667H3.333a.667.667 0 01-.666-.667v-4a.667.667 0 00-1.333 0v4a2 2 0 002 2h9.333a2 2 0 002-2v-4A.667.667 0 0014 8.499z"></Path>
  </Svg>
);
