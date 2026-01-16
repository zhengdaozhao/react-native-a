import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { ListItem } from '@rneui/base';
import { mongodbService } from './api/mongodbService';
import { Initdson } from './types';
import { colors } from './Colors';

export function ItemListView({ navigation, route }) {
  const [dsons, setDsons] = useState<Initdson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllItems, setShowAllItems] = useState(true);
  const userEmail = 'user@example.com'; // 从认证获取

  const fetchDsons = useCallback(async () => {
    setLoading(true);
    try {
      const filter = showAllItems ? {} : { username: userEmail };
      const result = await mongodbService.query<Initdson>('initdson', filter);
      setDsons(result.documents || []);
    } catch (error) {
      Alert.alert('Error', '获取数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [showAllItems, userEmail]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDsons();
    });
    return unsubscribe;
  }, [fetchDsons, navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Initdson }) => {
      try {
        const allsub = JSON.parse(item.allsub);
        const subKey = String(allsub[0]?.key || '');
        const subLabel = String(allsub[0]?.label || '');
        const displayText = subKey.replace(subLabel, '');

        return (
          <ListItem
            key={item._id}
            bottomDivider
            topDivider
            onPress={() =>
              navigation.navigate('zhipingdabi', {
                subject: subKey,
              })
            }
          >
            <ListItem.Title style={styles.itemContent}>
              {displayText}
            </ListItem.Title>
          </ListItem>
        );
      } catch (error) {
        return null;
      }
    },
    [navigation]
  );

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>显示所有项目?</Text>
          <Switch
            trackColor={{ true: '#00ED64' }}
            onValueChange={() => setShowAllItems(!showAllItems)}
            value={showAllItems}
          />
        </View>
        <FlatList
          keyExtractor={(item) => item._id || ''}
          data={dsons}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchDsons}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: { flex: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  toggleText: { flex: 1, fontSize: 16 },
  itemContent: {
    color: '#9966cc',
    flex: 1,
    fontSize: 28,
  },
});