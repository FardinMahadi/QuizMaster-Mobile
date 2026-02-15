import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { adminApi } from '../api/api';
import { Subject } from '../types';
import { Card, Button, InputModal } from '../components/Common';
import { Plus, Trash2, ChevronRight, Settings } from 'lucide-react-native';

export default function AdminDashboard({ navigation }: any) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApi.getAllSubjects();
      setSubjects(res.data);
    } catch (error) {
      console.error('Failed to fetch admin subjects', error);
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

  const handleCreateSubject = async () => {
    if (!newSubjectName) return;
    try {
        await adminApi.createSubject({ 
            name: newSubjectName, 
            code: newSubjectName.substring(0, 3).toUpperCase() 
        });
        setModalVisible(false);
        setNewSubjectName('');
        fetchData();
    } catch (error) {
        Alert.alert("Error", "Failed to create subject");
    }
  };

  const handleDeleteSubject = (id: number) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject? All associated quizzes will also be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await adminApi.deleteSubject(id);
              fetchData();
            } catch (error) {
              Alert.alert("Error", "Failed to delete subject");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-4 py-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Admin Panel</Text>
            <Text className="text-gray-600">Manage your quiz ecosystem</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AdminResultsMonitoring')}
            className="bg-white p-3 rounded-full shadow-sm border border-gray-100"
          >
            <Settings size={20} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Subjects</Text>
            <TouchableOpacity 
              className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => setModalVisible(true)}
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-bold ml-1">Add New</Text>
            </TouchableOpacity>
          </View>

          {subjects.map((subject) => (
            <Card key={subject.id} className="mb-4">
              <View className="p-4 flex-row justify-between items-center">
                <TouchableOpacity 
                  className="flex-1"
                  onPress={() => navigation.navigate('AdminQuizManagement', { subjectId: subject.id, subjectName: subject.name })}
                >
                  <Text className="text-lg font-bold">{subject.name}</Text>
                  <Text className="text-gray-500 text-sm">{subject.code}</Text>
                </TouchableOpacity>
                
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={() => handleDeleteSubject(subject.id)}
                    className="p-2 mr-2"
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>
              </View>
            </Card>
          ))}

          {subjects.length === 0 && (
            <Text className="text-gray-500 italic text-center mt-4">No subjects found.</Text>
          )}
        </View>
      </ScrollView>

      <InputModal
        visible={modalVisible}
        title="New Subject"
        placeholder="Enter subject name"
        value={newSubjectName}
        onChangeText={setNewSubjectName}
        onConfirm={handleCreateSubject}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
