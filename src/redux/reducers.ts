import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import chatsReducer from './chats/reducer';
import mediaReducer from './media/reducer';
import memoryReducer from './memory/reducer';
import shareReducer from './share/reducer';
import addToPlaylistReducer from './addplaylist/reducer';
import profileReducer from './profile/reducer';
import mapReducer from './map/reducer';

export default {
  app: appReducer,
  auth: authReducer,
  chats: chatsReducer,
  share: shareReducer,
  addToPlaylist: addToPlaylistReducer,
  media: mediaReducer,
  memory: memoryReducer,
  profile: profileReducer,
  map: mapReducer,
};
