import {socket} from 'screens/Auth';

const KEY_SOCKET_TRACK_LISTENING = 'listeningTrack';
const KEY_SOCKET_TRACK_STOP_LISTEN = 'endlisteningTrack';
const KEY_SOCKET_ENTER_RADIO = 'enterRadio';
const KEY_SOCKET_EXIT_RADIO = 'exitRadio';
const KEY_SOCKET_SHARE_TO_SLAMBOOK = 'comment-topic';
const KEY_SOCKET_LISTEN_DEBATE = 'listenDebate';
const KEY_SOCKET_SEND_MESSAGE = 'send-message-to-bubble';

export const eventTrackListening = (trackId: string, userId: string) => {
  socket.emit(KEY_SOCKET_TRACK_LISTENING, {
    track: trackId,
    user: userId,
    location: [1, 1],
  });
};

export const eventStopTrackListen = (userId: string) => {
  socket.emit(KEY_SOCKET_TRACK_STOP_LISTEN, {
    user: userId,
  });
};

export const eventEnterRadio = (userId: string, radioId: string) => {
  socket.emit(KEY_SOCKET_ENTER_RADIO, {
    user: userId,
    radio: radioId,
  });
};

export const eventExitRadio = (userId: string, radioId: string) => {
  socket.emit(KEY_SOCKET_EXIT_RADIO, {
    user: userId,
    radio: radioId,
  });
};

export const eventShareToSlambook = param => {
  socket.emit(KEY_SOCKET_SHARE_TO_SLAMBOOK, param);
};

export const eventListenDebate = param => {
  socket.emit(KEY_SOCKET_LISTEN_DEBATE, param);
};

export const eventSendMessageGroup = param => {
  socket.emit(KEY_SOCKET_SEND_MESSAGE, param);
};
