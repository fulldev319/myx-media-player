import {useRoute} from '@react-navigation/native';
import {apiGetUserInfo} from 'helper/userHelpers';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {ProfilePage} from '.';

export const OtherProfilePage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {params} = useRoute();
  const [userInfo, setUserInfo] = useState<any>({});

  const getUserInfo = async () => {
    apiGetUserInfo(params?.userId).then(res => {
      setUserInfo(res.user);
    });
  };

  useEffect(() => {
    if (params?.userId) {
      getUserInfo();
    }
  }, [params]);

  return (
    <>
      {userInfo && (
        <ProfilePage
          isSelf={false}
          userInfo={userInfo}
          userId={params?.userId}
          updateUserInfo={getUserInfo}
        />
      )}
    </>
  );
};
