import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const LocationIcon = () => {
  const [locationName, setLocationName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (place) {
        const name = ` ${place.city || place.district || ''}, ${place.region || ''}`;
        setLocationName(name);
      } else {
        setLocationName('Location not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-start">
      <TouchableOpacity onPress={handleGetLocation} disabled={loading}>
        <View className="flex-row items-center">
          <SimpleLineIcons name="location-pin" size={24} />
          <Text className="font-bold">Address</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </View>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="small" color="#888" className="mt-2" />
      ) : locationName ? (
        <Text className="text-sm text-gray-600 text-center mt-2">{locationName}</Text>
      ) : (
        <Text className="text-sm text-gray-600 text-center mt-2">Please Add Location</Text>
      )}
    </View>
  );
};

export default LocationIcon;
