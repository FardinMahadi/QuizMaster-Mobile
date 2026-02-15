import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { adminApi } from '../api/api';
import { Question } from '../types';
import { Card, Button } from '../components/Common';
import { Plus, Check, Circle } from 'lucide-react-native';

export default function AdminQuestionManagement({ route, navigation }: any) {
  const { quizId, quizTitle } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApi.getQuestions(quizId);
      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  }, [quizId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleAddQuestion = () => {
    // In a real app, this would be a full form screen or complex modal
    Alert.alert("New Question", "In this demo, we'll add a sample question.", [
        { text: "Cancel" },
        { 
            text: "Add Sample", 
            onPress: () => {
                adminApi.addQuestion(quizId, {
                    text: "Sample Question Text?",
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctAnswer: "Option A",
                    marks: 5
                })
                .then(() => fetchData())
                .catch(() => Alert.alert("Error", "Failed to add question"));
            }
        }
    ]);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 px-4 py-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">{quizTitle}</Text>
        <Text className="text-gray-600">Manage questions for this quiz</Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Questions ({questions.length})</Text>
        <TouchableOpacity 
          className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={handleAddQuestion}
        >
          <Plus size={18} color="white" />
          <Text className="text-white font-bold ml-1">Add Question</Text>
        </TouchableOpacity>
      </View>

      {questions.map((question, index) => (
        <Card key={question.id || index} className="mb-6 p-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Q{index + 1}. {question.text}
          </Text>
          
          <View className="space-y-2">
            {question.options.map((option, optIndex) => (
              <View 
                key={optIndex} 
                className={`flex-row items-center p-3 rounded-lg border ${option === question.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
              >
                {option === question.correctAnswer ? (
                  <Check size={16} color="#16a34a" />
                ) : (
                  <Circle size={16} color="#9ca3af" />
                )}
                <Text className={`ml-3 ${option === question.correctAnswer ? 'text-green-800 font-bold' : 'text-gray-700'}`}>
                  {option}
                </Text>
              </View>
            ))}
          </View>
          
          <View className="mt-4 pt-4 border-t border-gray-50 items-end">
            <Text className="text-gray-500 text-sm font-medium">Marks: {question.marks}</Text>
          </View>
        </Card>
      ))}

      {questions.length === 0 && (
        <Text className="text-gray-500 italic text-center mt-4">No questions added yet.</Text>
      )}
      
      <View className="h-10" />
    </ScrollView>
  );
}
