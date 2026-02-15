import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { BookOpen, Trophy, ArrowRight, X } from 'lucide-react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className, ...props }: any) {
  return (
    <View className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)} {...props}>
      {children}
    </View>
  );
}

export function Button({ title, onPress, className, variant = 'primary', icon: Icon, disabled }: any) {
  const variants = {
    primary: 'bg-indigo-600 text-white',
    ghost: 'bg-transparent text-gray-600',
    outline: 'bg-transparent border border-gray-200 text-gray-700',
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      className={cn("flex-row items-center justify-center py-3 px-4 rounded-lg", variants[variant as keyof typeof variants], disabled ? 'opacity-50' : '', className)}
    >
      <Text className={cn("font-semibold text-center", variant === 'primary' ? 'text-white' : 'text-gray-700')}>
        {title}
      </Text>
      {Icon && <Icon size={18} color={variant === 'primary' ? 'white' : '#4b5563'} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
}

export function InputModal({ visible, title, value, onChangeText, onConfirm, onClose, placeholder }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center px-6">
        <View className="bg-white rounded-2xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-800 mb-6"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            autoFocus
          />
          
          <View className="flex-row space-x-3">
            <View className="flex-1">
                <Button title="Cancel" variant="outline" onPress={onClose} />
            </View>
            <View className="flex-1">
                <Button title="Confirm" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
