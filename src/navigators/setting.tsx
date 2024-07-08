import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {MyContactsPage} from 'screens/MyContactsPage';
import {OtherProfilePage} from 'screens/ProfilePage/OtherProfilePage';
import ProfilePage from 'components/profile';
import MyGroupPage from 'screens/my_group';
import GroupPage from 'screens/group';

const Stack = createStackNavigator();

export const SettingNavigator = () => {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator initialRouteName={'MyGroups'}>
        <Stack.Screen
          name="MyGroups"
          component={MyGroupPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GroupPage"
          component={GroupPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyProfilePage"
          component={ProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtherProfilePage"
          component={OtherProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyContactsPage"
          component={MyContactsPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};
