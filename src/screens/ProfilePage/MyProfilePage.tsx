import {apiGetUserInfo} from 'helper/userHelpers';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {ProfilePage} from '.';
import actions from 'redux/auth/actions';

export const MyProfilePage = ({animStyle = null}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<any>(user);

  const updateUserInfo = () => {
    if (user?.id) {
      apiGetUserInfo(user?.id).then(res => {
        dispatch(actions.updateProfileRequest(res.user));
      });
    }
  };

  useEffect(() => {
    updateUserInfo();
  }, []);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  return (
    <ProfilePage
      isSelf={true}
      userInfo={userInfo}
      userId={user?.id}
      updateUserInfo={updateUserInfo}
      animStyle={animStyle}
    />
  );
};
