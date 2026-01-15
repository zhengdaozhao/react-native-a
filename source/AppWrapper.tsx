import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { App } from './App';
import { WelcomeView } from './WelcomeView';

const LoadingIndicator = () => {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export const AppWrapper = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return user ? (
    <App user={user} onLogout={handleLogout} />
  ) : (
    <WelcomeView onLogin={handleLogin} />
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});