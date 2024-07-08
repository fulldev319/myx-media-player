import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

type AuthContextType = {
  user: any;
  isLoggedIn: boolean;
  curPage: string;
  setCurPage: (string) => void;
  curFeedTab: string;
  setCurFeedTab: (FeedTabName) => void;
};

export enum PageName {
  NONE = '',
  PROFILE = 'profile',
}
export enum FeedTabName {
  Feed = 'Feed',
  Music = 'Music',
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
  children: any;
};

export const AuthContextProvider: React.FunctionComponent<
  AuthContextProviderProps
> = ({children}) => {
  const {user, isLoggedIn} = useSelector((state: RootState) => state.auth);
  const [curPage, setCurPage] = useState(PageName.NONE);
  const [curFeedTab, setCurFeedTab] = useState(FeedTabName.Feed);

  const context: AuthContextType = {
    user,
    isLoggedIn,
    curPage,
    setCurPage,
    curFeedTab,
    setCurFeedTab,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth hook must be used inside AuthContextProvider');
  }

  return context;
};
