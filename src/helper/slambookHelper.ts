import HttpClient from './apiClient';

export async function apiCreateSlamBook(title, memoryId, isPublic) {
  try {
    const params = {
      title,
      memoryId,
      isPublic,
    };

    const response = await HttpClient.postWithToken('/slambook/create', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetOwnedSlambook(params: {
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/slambook/owned', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAddMemoryToSlambook(params: {
  slambookId: string;
  memoryId: string;
  topic: string;
}) {
  try {
    const response = await HttpClient.postWithToken(
      '/slambook/addMemory',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCreateTopic(title, slamBookId, xPos, yPos) {
  try {
    const params = {
      title,
      slambookId: slamBookId,
      coordinates: [xPos, yPos],
      radius: 50,
    };

    const response = await HttpClient.postWithToken(
      '/slambook/createTopic',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSlamBooks(lastId = null) {
  try {
    const endUrl = lastId ? `?offset=${lastId}&limit=10` : '?limit=10';
    const response = await HttpClient.getWithToken(
      '/slambook/feed' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopics(slamBookId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topics?slambookId=${slamBookId}` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCreateTopicDiscussion(
  hashtags,
  mediaTypes,
  mediaUrls,
  slambook,
  topic,
  text,
) {
  try {
    const params = {
      hashtags,
      mediaTypes,
      mediaUrls,
      slambook,
      topic,
      text,
    };

    const response = await HttpClient.postWithToken(
      '/slambook/createTopicDiscussion',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCreateTopicComments(
  slambook,
  topic,
  message,
  hashTags,
  mediaTypes,
  mediaUrls,
  shareId,
  shareType,
) {
  try {
    const params = {
      slambook,
      topic,
      message,
      hashTags,
      mediaTypes,
      mediaUrls,
      shareId,
      shareType,
    };

    const response = await HttpClient.postWithToken(
      '/slambook/commentTopic',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicComments(
  slamBookId,
  topicId,
  limit = 10,
  lastId,
) {
  try {
    const endUrl = lastId !== null ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topicComments?slambookId=${slamBookId}&topicId=${topicId}&limit=${limit}` +
        endUrl,
      {},
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicSearchComments(
  slamBookId,
  topicId,
  searchText,
  lastId = null,
) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topicSearchComment?slambookId=${slamBookId}&topicId=${topicId}&search=${searchText}` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicSearchTags(
  slamBookId,
  topicId,
  searchText,
  lastId = null,
) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topicSearchHashTag?slambookId=${slamBookId}&topicId=${topicId}&hashTag=${searchText}` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSlamBookDetail(slamBookId) {
  try {
    const response = await HttpClient.getWithToken(
      `/slambook/get?slambookId=${slamBookId}`,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicRecentSearch(offset?: any) {
  try {
    const response = await HttpClient.getWithToken(
      '/slambook/topicRecentSearches',
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemoveTopicRecentSerch(term) {
  try {
    const params = {
      term,
    };

    const response = await HttpClient.postWithToken(
      'slambook/removeTopicSearch',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSlambookAddFriend(slambookId, arrFriendId) {
  try {
    const params = {
      tagId: slambookId,
      userIds: arrFriendId,
    };
    console.log(params);
    const response = await HttpClient.postWithToken('slambook/addTag', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetHashTagComments(
  slamBookId,
  topicId,
  hashTag,
  lastId = null,
) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/hashTagComments?slambookId=${slamBookId}&topicId=${topicId}&hashTag=${hashTag}&limit=10` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSlambookMemory(slamBookId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';

    const response = await HttpClient.getWithToken(
      `/slambook/memories?slambookId=${slamBookId}&limit=10` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicMember(slamBookId, topicId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';

    const response = await HttpClient.getWithToken(
      `/slambook/topicMembers?slambook=${slamBookId}&topic=${topicId}&limit=10` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicMemory(slamBookId, topicId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';

    const response = await HttpClient.getWithToken(
      `/slambook/memories?slambookId=${slamBookId}&topicId=${topicId}&limit=10` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicMedia(slamBookId, topicId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topicMedia?slambookId=${slamBookId}&topicId=${topicId}&limit=10` +
        endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSlambookMember(
  slamBookId,
  lastRole = null,
  lastId = null,
) {
  try {
    let endUrl = lastRole ? `&lastRole=${lastRole}` : '';
    endUrl = lastId ? `&offset=${lastId}` : '';

    const response = await HttpClient.getWithToken(
      `/slambook/members?slambook=${slamBookId}&limit=12` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiTopicReply(params: {
  slambook: string;
  topic: string;
  comment: string;
  message: string;
  hashTags: any;
  mediaTypes: any;
  mediaUrls: any;
}) {
  try {
    const response = await HttpClient.postWithToken(
      '/slambook/addTopicReply',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicReplies(params: {
  slambook: string;
  topic: string;
  comment: string;
  lastId?: string;
}) {
  try {
    const response = await HttpClient.getWithToken(
      `/slambook/topicReplies?slambookId=${params.slambook}&topicId=${params.topic}&commentId=${params.comment}`,
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopicEmoji(
  slambook: string,
  topic: string,
  comment: string,
  lastId?: string,
) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/slambook/topicEmojis?slambook=${slambook}&topic=${topic}&comment=${comment}` +
        endUrl,
      {},
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAddTopicEmoji(params: {
  slambook: string;
  topic: string;
  emoji: string;
  comment: string;
  mediaUrl: string;
}) {
  try {
    const response = await HttpClient.postWithToken(
      '/slambook/addTopicEmoji',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUpdateSlamBookTopic(params: {
  slambook: string;
  from: number;
  to: number;
  positions: any[];
}) {
  try {
    const response = await HttpClient.postWithToken(
      '/slambook/updateTopicPositions',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCreateRoom(params: any) {
  try {
    const response = await HttpClient.postWithToken(
      '/slambook/createRoom',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
