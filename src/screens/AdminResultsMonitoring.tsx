import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { adminApi } from '../api/api';
import { Result } from '../types';
import { Card } from '../components/Common';
import { User, Calendar, Trophy, ChevronRight } from 'lucide-react-native';

export default function AdminResultsMonitoring({ navigation }: any) {
  const [results, setResults] = useState<Result[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApi.getAllResults();
      setResults(res.data);
    } catch (error) {
      console.error('Failed to fetch all results', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 px-4 py-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Student Results</Text>
        <Text className="text-gray-600">Monitor performance across all quizzes</Text>
      </View>

      {results.map((result) => (
        <Card key={result.id} className="mb-4">
          <TouchableOpacity 
            className="p-4"
            onPress={() => navigation.navigate('ResultDetails', { resultId: result.id })}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{result.quizTitle}</Text>
                <View className="flex-row items-center mt-1 space-x-4">
                  <View className="flex-row items-center mr-4">
                    <User size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">Student ID: {result.studentId}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {new Date(result.attemptDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View className="items-end">
                <Text className={`text-lg font-bold ${result.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.percentage}%
                </Text>
                <View className="flex-row items-center">
                    <Text className="text-gray-400 text-xs mr-1">{result.score}/{result.totalMarks}</Text>
                    <ChevronRight size={16} color="#9ca3af" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      {results.length === 0 && (
        <Text className="text-gray-500 italic text-center mt-4">No results recorded yet.</Text>
      )}
    </ScrollView>
  );
}
