import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Text,
} from 'react-native';
import { mongodbService } from './api/mongodbService';
import { colors } from './Colors';

export function OneWriting({ navigation, route }) {
  const { writingId, subject } = route.params;
  const [writing, setWriting] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchWriting = useCallback(async () => {
    setLoading(true);
    try {
      const result = await mongodbService.query('writing', {
        _id: writingId,
      });
      if (result.documents && result.documents.length > 0) {
        const doc = result.documents[0];
        setWriting(doc);
        setTitle(doc.title || '');
        setContent(doc.content || '');
      }
    } catch (error) {
      Alert.alert('Error', '获取写作内容失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [writingId]);

  useEffect(() => {
    fetchWriting();
  }, [fetchWriting]);

  const handleSave = useCallback(async () => {
    try {
      await mongodbService.update(
        'writing',
        { _id: writingId },
        {
          title,
          content,
          updatedAt: new Date().toISOString(),
        }
      );
      Alert.alert('Success', '保存成功');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', '保存失败: ' + error.message);
    }
  }, [writingId, title, content, navigation]);

  const handleDelete = useCallback(async () => {
    Alert.alert('Delete', '确定要删除这篇文章吗?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await mongodbService.delete('writing', { _id: writingId });
            Alert.alert('Success', '删除成功');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', '删除失败: ' + error.message);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [writingId, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.contentContainer}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="标题"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="内容"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>保存</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>删除</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});