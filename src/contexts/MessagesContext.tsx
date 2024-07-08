import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {setLastView} from 'helper/chatHelpers';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

type MessagesContextType = {
  unreadMessages: number;
  setNumberMessages: (numberMessages: number) => void;
  markAllMessagesAsRead: () => void;
};

const MessagesContext = createContext<MessagesContextType | null>(null);

type MessagesContextProviderProps = {
  numberMessages: number;
  socket: any;
  children: any;
};

export const MessagesContextProvider: React.FunctionComponent<
  MessagesContextProviderProps
> = ({numberMessages, socket, children}) => {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const {user, isLoggedIn} = useSelector((state: RootState) => state.auth);
  const [currentUserId, setCurrentUserId] = useState();

  useEffect(() => {
    setUnreadMessages(numberMessages);
  }, [numberMessages]);

  useEffect(() => {
    if (user && user.id && isLoggedIn && socket) {
      setCurrentUserId(user.id);
      const incomingNumberOfMessagesHandler = number => {
        const {number: numberOfMessages} = number;

        setUnreadMessages(numberOfMessages);
      };

      socket.on('numberMessages', incomingNumberOfMessagesHandler);

      return () => {
        socket.removeListener(
          'numberMessages',
          incomingNumberOfMessagesHandler,
        );
      };
    }
  }, [user, isLoggedIn, socket]);

  const markAllMessagesAsRead = useCallback(async () => {
    if (currentUserId) {
      const chatObj = {
        userId: currentUserId,
        lastView: Date.now(),
      };

      const response = await setLastView(chatObj);
      if (response.success) {
        setUnreadMessages(0);
      }
    }
  }, [currentUserId]);

  const context = useMemo<MessagesContextType>(
    () => ({
      unreadMessages,
      setNumberMessages: numberMessages => {
        setUnreadMessages(numberMessages);
      },
      markAllMessagesAsRead,
    }),
    [markAllMessagesAsRead, unreadMessages],
  );

  return (
    <MessagesContext.Provider value={context}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error(
      'useMessages hook must be used inside MessagesContextProvider',
    );
  }

  return context;
};
