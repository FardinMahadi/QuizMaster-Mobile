import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { studentApi } from '../api/api';
import { Result } from '../types';
import { Button, Card } from '../components/Common';
import { CheckCircle, XCircle, Award } from 'lucide-react-native';

export default function ResultDetailsScreen({ route, navigation }: any) {
  const { resultId } = route.params;
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await studentApi.getResultDetails(resultId);
        setResult(res.data);
      } catch (error) {
        console.error('Failed to fetch result', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading) return <ActivityIndicator size="large" className="flex-1" />;
  if (!result) return <View className="flex-1 items-center justify-center"><Text>Result not found</Text></View>;

  const isPassed = result.percentage >= 40;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="items-center mb-8">
        <View className={`p-6 rounded-full ${isPassed ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
          {isPassed ? <Award size={64} color="#16a34a" /> : <XCircle size={64} color="#dc2626" />}
        </View>
        <Text className="text-3xl font-bold text-gray-900">{isPassed ? 'Congratulations!' : 'Keep Trying!'}</Text>
        <Text className="text-gray-500 text-lg">You scored {result.score} out of {result.totalMarks}</Text>
      </View>

      <Card className="p-6 mb-6">
        <Text className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Quiz Summary</Text>
        <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-50">
          <Text className="text-gray-700 font-medium">Quiz Title</Text>
          <Text className="font-bold text-gray-900">{result.quizTitle}</Text>
        </View>
        <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-50">
          <Text className="text-gray-700 font-medium">Percentage</Text>
          <Text className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{result.percentage}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700 font-medium">Date Attempted</Text>
          <Text className="text-gray-900 font-bold">{new Date(result.attemptDate).toLocaleDateString()}</Text>
        </View>
      </Card>

      <Button 
        title="Back to Home" 
        onPress={() => navigation.navigate('Dashboard')} 
        className="mb-10"
      />
    </ScrollView>
  );
}
