import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { authApi } from '../api/api';
import { Button, Card } from '../components/Common';
import { LogIn } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      // In a real app, we'd save the user data/token to a store or AsyncStorage
      // For this demo, we'll navigate directly based on response (usually role is included)
      const user = res.data;
      if (user.role === 'ADMIN') {
        navigation.replace('AdminDashboard');
      } else {
        navigation.replace('Dashboard');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Check your credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="items-center mb-10">
        <View className="bg-indigo-100 p-4 rounded-full mb-4">
          <LogIn size={40} color="#4f46e5" />
        </View>
        <Text className="text-3xl font-bold text-gray-900">Sign In</Text>
        <Text className="text-gray-500 mt-2">Access your quiz account</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 font-medium mb-1 ml-1">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-800"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-700 font-medium mb-1 ml-1">Password</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-800"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Button 
          title={loading ? "Signing In..." : "Sign In"} 
          onPress={handleLogin}
          className="mt-6"
          disabled={loading}
        />

        <TouchableOpacity 
          className="mt-4"
          onPress={() => navigation.navigate('Register')}
        >
          <Text className="text-center text-gray-600">
            Don't have an account? <Text className="text-indigo-600 font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
