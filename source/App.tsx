import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ItemListView } from './ItemListView';
import { CertainWriting } from './CertainWriting';
import { OneWriting } from './OneWriting';
import { LogoutButton } from './LogoutButton';

const Stack = createNativeStackNavigator();

export function App({ user, onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={ItemListView}
          options={{
            title: '写作列表',
            headerRight: () => <LogoutButton onLogout={onLogout} />,
          }}
        />
        <Stack.Screen
          name="zhipingdabi"
          component={CertainWriting}
          options={{ title: '选择写作' }}
        />
        <Stack.Screen
          name="writing"
          component={OneWriting}
          options={{ title: '编辑' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}