import React, {useState} from 'react';
import {ArrowLeftIcon} from 'assets/svg';
import {PrimaryModal} from 'components/common/PrimaryModal';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AddDiscussion from './AddDiscussion';
import CreateNewPost from './CreateNewPost';
import MakeScrap from './MakeScrap';

interface CreateNewPostModalProps {
  visible: boolean;
  hideModal: () => void;
  onDetail: (id: number) => void;
}

const CreateNewPostModal = (props: CreateNewPostModalProps) => {
  const {visible, hideModal, onDetail} = props;
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('');

  return (
    <PrimaryModal visible={visible} hideModal={hideModal}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 0) {
              hideModal();
            } else {
              setStep(step - 1);
            }
          }}>
          <ArrowLeftIcon color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 0 && 'Create New Post'}
          {step === 1 && 'Make scrap-notes'}
          {step === 2 && 'Add Discussion'}
        </Text>
      </View>

      <View style={styles.content}>
        {step === 0 && (
          <CreateNewPost
            onMakeScrap={() => setStep(1)}
            onRecording={() => setStep(2)}
          />
        )}
        {step === 1 && (
          <MakeScrap
            description={description}
            setDescription={val => setDescription(val)}
            onPress={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <AddDiscussion
            onDetail={onDetail}
            onHide={hideModal}
            description={description}
          />
        )}
      </View>
    </PrimaryModal>
  );
};

export default CreateNewPostModal;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginLeft: -20,
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '600',
  },
  backBtn: {
    padding: 5,
    zIndex: 2,
  },
  content: {
    marginTop: 25,
  },
});
