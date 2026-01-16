import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem } from '@rneui/base';
import { mongodbService } from './api/mongodbService';
import { Writing } from './types';
import { colors } from './Colors';

export function CertainWriting({ navigation, route }) {
  const { subject } = route.params;
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWritings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await mongodbService.query<Writing>('writing', {
        subject: subject,
      });
      setWritings(result.documents || []);
    } catch (error) {
      Alert.alert('Error', '获取写作列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchWritings();
  }, [fetchWritings]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWritings();
    });
    return unsubscribe;
  }, [fetchWritings, navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Writing }) => (
      <ListItem
        key={item._id}
        bottomDivider
        topDivider
        onPress={() =>
          navigation.navigate('writing', {
            writingId: item._id,
            subject: subject,
          })
        }
      >
        <ListItem.Title style={styles.itemContent}>
          {item.title || '未命名'}
        </ListItem.Title>
        <ListItem.Subtitle>{item.createdAt || ''}</ListItem.Subtitle>
      </ListItem>
    ),
    [navigation, subject]
  );

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Text style={styles.subjectTitle}>{subject}</Text>
        <FlatList
          keyExtractor={(item) => item._id || ''}
          data={writings}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchWritings}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: { flex: 1 },
  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 12,
    color: colors.primary,
  },
  itemContent: {
    color: '#9966cc',
    flex: 1,
    fontSize: 18,
  },
});