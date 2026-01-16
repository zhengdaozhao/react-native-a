import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { mongodbService } from './api/mongodbService';
import { colors } from './Colors';

export function WelcomeView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Error', '请输入邮箱和密码');
      return;
    }

    setLoading(true);
    try {
      // 查询用户是否存在
      const result = await mongodbService.query('users', {
        email: email,
      });

      if (result.documents && result.documents.length > 0) {
        const user = result.documents[0];
        
        // 验证密码（实际应用中应使用 bcrypt）
        if (user.password === password) {
          // 登录成功
          onLogin({
            _id: user._id,
            email: user.email,
            username: user.username,
          });
        } else {
          Alert.alert('Error', '密码错误');
        }
      } else {
        Alert.alert('Error', '用户不存在');
      }
    } catch (error) {
      Alert.alert('Error', '登录失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, onLogin]);

  const handleSignUp = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Error', '请输入邮箱和密码');
      return;
    }

    setLoading(true);
    try {
      // 检查用户是否已存在
      const existing = await mongodbService.query('users', {
        email: email,
      });

      if (existing.documents && existing.documents.length > 0) {
        Alert.alert('Error', '用户已存在');
        setLoading(false);
        return;
      }

      // 创建新用户
      const result = await mongodbService.insert('users', {
        email: email,
        password: password, // 实际应用中应使用 bcrypt 加密
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      });

      if (result.insertedId) {
        Alert.alert('Success', '注册成功，请登录');
        setIsSignUp(false);
        setPassword('');
      }
    } catch (error) {
      Alert.alert('Error', '注册失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>写作助手</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? '创建新账户' : '登录'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isSignUp ? handleSignUp : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? '注册' : '登录'}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setIsSignUp(!isSignUp);
            setPassword('');
          }}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {isSignUp
              ? '已有账户？返回登录'
              : '没有账户？创建新账户'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00ED64',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});