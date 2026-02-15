import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { studentApi } from '../api/api';
import { Question } from '../types';
import { Button, Card } from '../components/Common';
import { Timer, Send } from 'lucide-react-native';

export default function QuizScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await studentApi.getQuizDetails(quizId);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.durationMinutes * 60);
      } catch (error) {
        Alert.alert('Error', 'Failed to load quiz');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: option
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await studentApi.submitQuiz(quizId, selectedAnswers);
      navigation.replace('ResultDetails', { resultId: res.data.id });
    } catch (error) {
      Alert.alert('Submission Failed', 'Could not submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" className="flex-1" />;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View className="flex-1 bg-white">
      <View className="bg-indigo-600 px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold text-xl">Question {currentQuestionIndex + 1}/{questions.length}</Text>
          <View className="flex-row items-center bg-indigo-500 px-3 py-1 rounded-full">
            <Timer size={16} color="white" />
            <Text className="text-white font-bold ml-1">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
        <View className="h-2 bg-indigo-400 rounded-full">
          <View className="h-2 bg-white rounded-full" style={{ width: `${progress}%` }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <Text className="text-xl font-bold text-gray-900 mb-8">{currentQuestion.text}</Text>
        
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectOption(option)}
            className={cn(
              "p-4 rounded-xl border-2 mb-4",
              selectedAnswers[currentQuestion.id] === option 
                ? "border-indigo-600 bg-indigo-50" 
                : "border-gray-100 bg-gray-50"
            )}
          >
            <Text className={cn(
              "text-lg",
              selectedAnswers[currentQuestion.id] === option ? "text-indigo-700 font-bold" : "text-gray-700"
            )}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-6 py-8 border-t border-gray-100 flex-row space-x-4">
        {currentQuestionIndex > 0 && (
          <Button 
            variant="outline"
            title="Previous" 
            className="flex-1"
            onPress={() => setCurrentQuestionIndex(prev => prev - 1)} 
          />
        )}
        
        {currentQuestionIndex < questions.length - 1 ? (
          <Button 
            title="Next" 
            className="flex-1"
            onPress={() => setCurrentQuestionIndex(prev => prev + 1)} 
          />
        ) : (
          <Button 
            title="Submit Quiz" 
            className="flex-1"
            icon={Send}
            onPress={() => {
              Alert.alert('Submit Quiz', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: handleSubmit }
              ]);
            }} 
          />
        )}
      </View>
    </View>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
