// Interface to define all types for Redux (Typescript requirement)
export interface RootState {
  app: {
    loading: boolean;
    showDialogAddToNFT: boolean;
    showMagicSearch: boolean;
    showAddPlayList: boolean;
    showEditPlayList: boolean;
    showDialogAddMyContact: boolean;
    snakeSuccessMessage: string;
    loadContacts: boolean;
    data: any;
  };
  auth: {
    loading: boolean;
    isLoggedIn: boolean;
    user: any;
    countries: Country[];
    onboarding: boolean;
  };
  share: {
    showShare: boolean;
    itemData: any;
  };
  addToPlaylist: {
    showAddToPlaylist: boolean;
    itemData: any;
  };
  media: {
    mediaPlayerVisible: boolean;
    // mediaIsPlaying: boolean;
    selectedMedia: any;
    selectedMediaId: any;
    mediaPlayList: any[];
    mediaProcessData: any;
    shouldUpdate: boolean;
    // playerAction: string;
  };
  memory: {
    tagFriends: any[];
    mediaData: any[];
    mediaUrls: any[];
  };
  chats: {
    allChats: {
      loading: boolean;
      data: any;
      searchedData: any;
      error: string;
    };
    uploadFile: {
      loading: boolean;
      data: any;
      error: string;
    };
    currentChat: any;
  };
  profile: {
    taggedRequestCount: any;
  };
  map: {
    mapSetting: MapSettingType;
    mapSize: MapSizeType;
  };
}

export interface MapSettingType {
  radios: boolean;
  friends: boolean;
  artists: boolean;
  memories: boolean;
}

export interface MapSizeType {
  lat: number;
  long: number;
}

export interface Country {
  country: number;
  name: string;
  image: string;
};
