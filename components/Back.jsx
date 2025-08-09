import React, { useCallback, memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Back = ({
  title = 'Back',
  onPress,
  url,
  iconColor = 'black',
  iconSize = 24,
  textClassName = 'text-xl font-semibold',
  containerClassName = 'flex-row items-center gap-4 my-2 mx-1',
}) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (url) {
      router.replace(url);
    } else {
      router.back();
    }
  }, [onPress, router]);

  return (
    <TouchableOpacity onPress={handlePress} className={containerClassName}>
      <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
      <Text className={textClassName}>{title}</Text>
    </TouchableOpacity>
  );
};

export default memo(Back);
