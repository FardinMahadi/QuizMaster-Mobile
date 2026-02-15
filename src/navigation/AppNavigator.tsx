import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDashboard from '../screens/StudentDashboard';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultDetailsScreen from '../screens/ResultDetailsScreen';
import StudentResultsHistory from '../screens/StudentResultsHistory';
import AdminDashboard from '../screens/AdminDashboard';
import AdminQuizManagement from '../screens/AdminQuizManagement';
import AdminQuestionManagement from '../screens/AdminQuestionManagement';
import AdminResultsMonitoring from '../screens/AdminResultsMonitoring';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={StudentDashboard} 
          options={{ title: 'Quiz Dashboard' }}
        />
        <Stack.Screen 
          name="QuizScreen" 
          component={QuizScreen} 
          options={{ title: 'Attempt Quiz', headerShown: false }}
        />
        <Stack.Screen 
          name="ResultDetails" 
          component={ResultDetailsScreen} 
          options={{ title: 'Quiz Result' }}
        />
        <Stack.Screen 
          name="ResultsHistory" 
          component={StudentResultsHistory} 
          options={{ title: 'My History' }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ title: 'Admin Controls' }}
        />
        <Stack.Screen 
          name="AdminQuizManagement" 
          component={AdminQuizManagement} 
          options={{ title: 'Manage Quizzes' }}
        />
        <Stack.Screen 
          name="AdminQuestionManagement" 
          component={AdminQuestionManagement} 
          options={{ title: 'Manage Questions' }}
        />
        <Stack.Screen 
          name="AdminResultsMonitoring" 
          component={AdminResultsMonitoring} 
          options={{ title: 'Results Monitoring' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
