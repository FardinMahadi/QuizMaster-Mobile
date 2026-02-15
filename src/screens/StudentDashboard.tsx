import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { studentApi } from '../api/api';
import { Subject, Quiz } from '../types';
import { Card, Button } from '../components/Common';
import { BookOpen, Trophy, ArrowRight } from 'lucide-react-native';

export default function StudentDashboard({ navigation }: any) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await studentApi.getSubjects();
      setSubjects(res.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    if (selectedSubject) {
        handleSelectSubject(selectedSubject);
    }
    setRefreshing(false);
  }, [fetchData, selectedSubject]);

  const handleSelectSubject = async (subject: Subject) => {
    setSelectedSubject(subject);
    try {
      const res = await studentApi.getAvailableQuizzes(subject.id);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Failed to fetch quizzes', error);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 px-4 py-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Welcome Back!</Text>
          <Text className="text-gray-600">Choose a subject to see available quizzes.</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ResultsHistory')}
          className="bg-white p-3 rounded-full shadow-sm border border-gray-100"
        >
          <Trophy size={20} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className={`w-[48%] mb-4 ${selectedSubject?.id === subject.id ? 'border-indigo-600 border-2' : ''}`}
          >
            <TouchableOpacity onPress={() => handleSelectSubject(subject)} className="p-4">
                <View className="bg-indigo-50 p-2 rounded-lg w-10 h-10 items-center justify-center mb-2">
                    <BookOpen size={20} color="#4f46e5" />
                </View>
                <Text className="font-bold text-lg" numberOfLines={1}>{subject.name}</Text>
                <Text className="text-gray-500 text-xs mb-2">{subject.code}</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {selectedSubject && (
        <View className="mt-8 mb-10">
          <View className="flex-row items-center mb-4">
            <Trophy size={24} color="#f59e0b" />
            <Text className="text-xl font-bold ml-2">Quizzes for {selectedSubject.name}</Text>
          </View>
          
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="mb-4">
                <View className="p-4">
                    <Text className="text-lg font-bold">{quiz.title}</Text>
                    <Text className="text-gray-500 text-sm mb-3">
                        {quiz.durationMinutes} minutes | {quiz.totalMarks} marks
                    </Text>
                    <Text className="text-gray-600 text-sm mb-4" numberOfLines={2}>
                        {quiz.description}
                    </Text>
                    <Button 
                        title="Start Quiz" 
                        onPress={() => navigation.navigate('QuizScreen', { quizId: quiz.id })} 
                    />
                </View>
            </Card>
          ))}
          
          {quizzes.length === 0 && (
            <Text className="text-gray-500 italic text-center mt-4">No quizzes available yet.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
