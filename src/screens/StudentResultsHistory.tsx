import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { studentApi } from '../api/api';
import { Result } from '../types';
import { Card } from '../components/Common';
import { Calendar, ChevronRight, Trophy } from 'lucide-react-native';

export default function StudentResultsHistory({ navigation }: any) {
  const [results, setResults] = useState<Result[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const res = await studentApi.getResults();
      setResults(res.data);
    } catch (error) {
      console.error('Failed to fetch results history', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4 py-6">
        <View className="flex-row items-center mb-6">
          <View className="bg-amber-100 p-2 rounded-lg mr-3">
            <Trophy size={24} color="#d97706" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-900">Quiz History</Text>
            <Text className="text-gray-500">Track your performance over time</Text>
          </View>
        </View>

        {results.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-gray-400 italic">No quiz attempts yet.</Text>
          </View>
        ) : (
          results.map((result) => (
            <Card key={result.id} className="mb-4 overflow-hidden">
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ResultDetails', { resultId: result.id })}
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                      {result.quizTitle}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Calendar size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {new Date(result.attemptDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="items-end mr-3">
                      <Text className={`text-xl font-bold ${result.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {result.score}/{result.totalMarks}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#9ca3af" />
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}
