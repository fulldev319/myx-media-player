import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StatusBar, useToast} from 'native-base';

import {
  FlagIcon,
  GroupIcon,
  BackIcon,
  GroupPlusIcon,
  CreateNewIcon,
} from './assets';
import {styles} from './index.styles';
import CreateNewBubbleSheet from './components/CreateNewBubble';
import {SCREEN_WIDTH} from 'helper/utils';
import {
  apiGetGroupsBubbles,
  apiPostCreateBubble,
  apiPostUpdateBubbleInfo,
  apiPostUpdateBubblePositions,
} from 'helper/groupHelper';
import GroupBubble from './components/GroupBubble';
import ManageIcon from './assets/ManageIcon';
import { CustomToast } from 'components/common';

const GroupBookPage = props => {
  const navigation = useNavigation();
  const {group} = props.route?.params;
  const toast = useToast();

  const [visibleCreateNewBubbleSheet, setVisibleCreateNewBubbleSheet] =
    useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [groupBubbles, setGroupBubbles] = useState([]);
  const [selectedBubble, setSelectedBubble] = useState({});
  const [bubbleMaxPosX, setBubbleMaxPosX] = useState(0);
  const [bubbleMaxPosY, setBubbleMaxPosY] = useState(0);
  const [isMember, setIsMember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [bubbleRequests, setBubbleRequests] = useState(0);
  const [bubbleCreator, setBubbleCreator] = useState(false);

  useEffect(() => {
    loadGroupBubble();
  }, []);

  const initGroupBubble = async () => {
    setTimeout(async () => {
      const params = {
        group: group.id,
        limit: 10,
        offset: 0,
      };
      const res = await apiGetGroupsBubbles(params);
      if (res.data?.success) {
        setBubbleRequests(res.requests);
        setBubbleCreator(res.isCreator);
        setHasMore(res.data?.hasMore);
        setLastId(res.data?.lastId);
        setIsMember(!!res.data?.isMember);
        setGroupBubbles(res.data?.data);
      }
    }, 1000);
  };

  const loadGroupBubble = async () => {
    if (!isLoading && hasMore) {
      const params = {
        group: group.id,
        limit: 10,
        offset: lastId,
      };
      const res = await apiGetGroupsBubbles(params);

      if (res.data?.success) {
        setHasMore(res.data?.hasMore);
        setLastId(res.data?.lastId);
        setIsMember(!!res.data?.isMember);
        setGroupBubbles(prev => [...prev, ...res.data?.data]);
      }
    }
  };

  const _updateGroupBubble = async newGroupBubble => {
    const updatedPositions = newGroupBubble.map((bubble, _) => {
      const position1 = bubble.position
        ? bubble.position[0]
        : bubble.coordinates[0];
      const position2 = bubble.position
        ? bubble.position[1]
        : bubble.coordinates[1];
      return {
        id: bubble.id,
        x: position1,
        y: position2,
        radius: bubble.radius,
      };
    });
    const data = {
      group: group.id,
      bubbles: updatedPositions,
    };

    const res = await apiPostUpdateBubblePositions(data);
    if (res.success) {
      await initGroupBubble();
    } else {
      alert(JSON.stringify(res.error));
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.rowItem}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{group.name}</Text>
        </View>
        <View style={styles.rowItem}>
          <TouchableOpacity>
            <FlagIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <GroupIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderManageHeader = () => {
    if (!bubbleCreator) return;
    return (
      <View style={styles.manageHeader}>
        <View style={styles.rowItem}>
          <GroupPlusIcon />
          <Text style={styles.groupNewTxt}>{bubbleRequests}</Text>
        </View>
        <TouchableOpacity>
          <ManageIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const onUpdateImage = bubble => {
    setSelectedBubble(bubble);
    setVisibleCreateNewBubbleSheet(true);
  };

  const renderGroupBubbles = () => {
    return (
      <GroupBubble
        id={group.id}
        bubbles={groupBubbles}
        onUpdate={_updateGroupBubble}
        onUpdateMaxPosX={setBubbleMaxPosX}
        onUpdateMaxPosY={setBubbleMaxPosY}
        onUpdateImage={onUpdateImage}
      />
    );
  };

  const renderCreateButton = () => {
    if (!isMember) return;
    return (
      <TouchableOpacity
        onPress={() => setVisibleCreateNewBubbleSheet(true)}
        style={styles.createNewBtn}>
        <CreateNewIcon />
      </TouchableOpacity>
    );
  };

  const createNewBubble = async data => {
    setIsCreating(true);
    const newPosX = SCREEN_WIDTH / 2 - 25;
    const newPosY = bubbleMaxPosY + 50;

    const req_params = {
      group: group.id,
      name: data.name,
      description: data.description,
      image: data.image,
      tags: ['string'],
      is_private: true,
      x: newPosX < 50 ? 100 : newPosX,
      y: newPosY < 50 ? 100 : newPosY,
      radius: 80,
    };

    const res = await apiPostCreateBubble(req_params);
    if (res.success) {
      setVisibleCreateNewBubbleSheet(false);
      setSelectedBubble({});
      initGroupBubble();
    } else {
      alert(JSON.stringify(res.error));
    }
    setIsCreating(false);
  };

  const updateBubbleImage = async data => {
    if (!isMember) return;
    setIsCreating(true);
    const params = {
      group: group.id,
      bubble: Number(selectedBubble?.id),
      image: data.image || null,
      name: data.name
    };

    const res = await apiPostUpdateBubbleInfo(params);

    if (res.success) {
      setSelectedBubble({});
      initGroupBubble();
      setVisibleCreateNewBubbleSheet(false);
      toast.show({
        render: () => (
          <CustomToast
            title="Success updating bubble"
            color="#08b883"
            onRightPress={() => {}}
          />
        ),
        placement: 'top',
      });
    } else {
      alert(JSON.stringify(res.error));
    }
    setIsCreating(false);
  };

  const onUpdateBubble = data => {
    if (selectedBubble?.id) {
      updateBubbleImage(data);
    } else {
      createNewBubble(data);
    }
  };

  const hideModal = () => {
    setSelectedBubble({});
    setVisibleCreateNewBubbleSheet(false);
  };

  const renderCreateNewBubbleSheet = () => {
    if (!visibleCreateNewBubbleSheet) return null;
    return (
      <CreateNewBubbleSheet
        visible={visibleCreateNewBubbleSheet}
        hideModal={hideModal}
        isUpdating={isCreating}
        onUpdateBubble={onUpdateBubble}
        selectedBubble={selectedBubble}
        isMember={isMember}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {renderHeader()}
        {renderManageHeader()}
        {renderGroupBubbles()}
        {renderCreateButton()}
        {renderCreateNewBubbleSheet()}
      </View>
    </View>
  );
};

export default GroupBookPage;
