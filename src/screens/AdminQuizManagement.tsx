import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { adminApi } from '../api/api';
import { Quiz } from '../types';
import { Card, Button, InputModal } from '../components/Common';
import { Plus, ChevronRight, HelpCircle, Clock } from 'lucide-react-native';

export default function AdminQuizManagement({ route, navigation }: any) {
  const { subjectId, subjectName } = route.params;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApi.getQuizzesBySubject(subjectId);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Failed to fetch admin quizzes', error);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleCreateQuiz = async () => {
    if (!newQuizTitle) return;
    try {
        await adminApi.createQuiz({ 
            title: newQuizTitle, 
            description: `Quiz for ${subjectName}`, 
            subjectId, 
            durationMinutes: 30, 
            totalMarks: 100 
        });
        setModalVisible(false);
        setNewQuizTitle('');
        fetchData();
    } catch (error) {
        Alert.alert("Error", "Failed to create quiz");
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-4 py-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">{subjectName}</Text>
          <Text className="text-gray-600">Manage quizzes for this subject</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Quizzes</Text>
          <TouchableOpacity 
            className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => setModalVisible(true)}
          >
            <Plus size={18} color="white" />
            <Text className="text-white font-bold ml-1">Add Quiz</Text>
          </TouchableOpacity>
        </View>

        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="mb-4">
            <TouchableOpacity 
              className="p-4"
              onPress={() => navigation.navigate('AdminQuestionManagement', { quizId: quiz.id, quizTitle: quiz.title })}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-lg font-bold">{quiz.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1 mr-4">{quiz.durationMinutes} min</Text>
                    <HelpCircle size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">{quiz.totalMarks} marks</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <Text className="text-gray-500 italic text-center mt-4">No quizzes found for this subject.</Text>
        )}
      </ScrollView>

      <InputModal
        visible={modalVisible}
        title="New Quiz"
        placeholder="Enter quiz title"
        value={newQuizTitle}
        onChangeText={setNewQuizTitle}
        onConfirm={handleCreateQuiz}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
