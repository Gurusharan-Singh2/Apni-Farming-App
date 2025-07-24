import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#bbf7d0',
        paddingVertical:3,
        paddingHorizontal: 6,
        borderRadius: 25, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginHorizontal: 32,
        marginTop: 8,

      }}
    >
      <Ionicons name="checkmark-circle" size={18} color="#059669" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#065f46', fontWeight: '600', fontSize: 13 }}>{text1}</Text>
        {text2 ? <Text style={{ color: '#047857', fontSize: 11 }}>{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7f1d1d', 
       
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginHorizontal: 16,
        marginTop: 32,
       
      }}
    >
      <Ionicons name="close-circle" size={18} color="#dc2626" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>{text1}</Text>
        {text2 ? <Text style={{ color: '#fca5a5', fontSize: 11 }}>{text2}</Text> : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dbeafe', // blue-100
        
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 25, // rounded-2xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginHorizontal: 20,
        marginTop: 8,
      }}
    >
      <Ionicons name="information-circle" size={18} color="#3b82f6" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#1e3a8a', fontWeight: '600', fontSize: 12 }}>{text1}</Text>
        {text2 ? <Text style={{ color: '#1d4ed8', fontSize: 11 }}>{text2}</Text> : null}
      </View>
    </View>
  ),
};
