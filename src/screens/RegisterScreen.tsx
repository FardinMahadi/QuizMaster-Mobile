import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { authApi } from '../api/api';
import { Button } from '../components/Common';
import { UserPlus } from 'lucide-react-native';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      Alert.alert('Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="px-6 py-12"
      >
        <View className="items-center mb-10 mt-10">
          <View className="bg-indigo-100 p-4 rounded-full mb-4">
            <UserPlus size={40} color="#4f46e5" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
          <Text className="text-gray-500 mt-2">Join the Online Quiz Platform</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-1 ml-1">Full Name</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-800"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mt-4">
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
            title={loading ? "Creating Account..." : "Sign Up"} 
            onPress={handleRegister}
            className="mt-8"
            disabled={loading}
          />

          <TouchableOpacity 
            className="mt-6"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-center text-gray-600">
              Already have an account? <Text className="text-indigo-600 font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
