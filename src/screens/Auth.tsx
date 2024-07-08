import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ModalPortal} from 'react-native-modals';
import AppNavigator, {navigationRef} from 'navigators';
import {useSelector} from 'react-redux';
import {apiGetUserCounters} from 'helper/chatHelpers';
import Config from 'react-native-config';
import io from 'socket.io-client';
import {RootState} from 'redux/interfaces';
import {MessagesContextProvider} from 'contexts/MessagesContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TracksContextProvider} from 'contexts/TrackContext';
import {AudioContextProvider} from 'contexts/AudioContext';

export let socket: any;
export const setSocket = (sock: any) => {
  socket = sock;
};

export const Auth = () => {
  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);
  const {user, isLoggedIn} = useSelector((state: RootState) => state.auth);
  const [internalSocket, setInternalSocket] = useState<any>(null);
  const timerRef = useRef<any>();

  const setUserCounters = async userId => {
    await apiGetUserCounters(userId).then(res => {
      if (res.success) {
        setNumberOfMessages(res.data.myUnseenMessagesCount ?? 0);
      }
    });
  };

  const connectSocket = async userId => {
    const sock = io(Config.SERVER_URL, {
      transports: ['websocket'],
    });
    sock.connect();
    sock.on('connect', () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      sock.emit('add user', userId);
      setSocket(sock);
      setInternalSocket(sock);
    });
    sock.on('disconnect', () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        console.log('--- called');
        sock.connect();
      }, 5000);
    });
    // sock && sock.emit('subscribeToYou', userId);
    return socket;
  };

  useEffect(() => {
    if (user && user.id) {
      setUserCounters(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id && isLoggedIn && !socket) {
      connectSocket(user.id);
    }
  }, [user, isLoggedIn]);

  return (
    <MessagesContextProvider
      socket={internalSocket}
      numberMessages={numberOfMessages}>
      <TracksContextProvider>
        <AudioContextProvider>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />
              <ModalPortal />
            </NavigationContainer>
          </SafeAreaProvider>
        </AudioContextProvider>
      </TracksContextProvider>
    </MessagesContextProvider>
  );
};
