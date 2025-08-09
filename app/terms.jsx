import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const SECTION_SPACING = 24;

const TermsAndConditionsScreen = () => {
  const router = useRouter();

  const sections = [
    {
      title: "1. Introduction",
      content:
        'Welcome to Apni Farming! By using our mobile application ("App") or services ("Services"), you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully.',
    },
   
    {
      title: "3. Account Registration",
      content:
        'Creating an account may be required to place orders. You are responsible for all activities under your account. Notify us immediately if you suspect unauthorized use.',
    },
    {
      title: "4. Product Information and Availability",
      content:
        'We strive to provide accurate product descriptions and prices. Products like fresh milk and vegetables are subject to availability and seasonal changes. Prices and availability may change without notice.',
    },
    {
      title: "5. Ordering and Payment",
      content:
        'Orders can be placed through the App. We accept cash on delivery with cash and upi  methods. Payment must be completed before processing. Delivery fees and taxes may apply.',
    },
    {
      title: "6. Cancellation, Refunds, and Returns",
      content:
        'Due to perishable nature of products, cancellations and returns are limited. Refunds apply only for damaged or incorrect items after verification.',
    },
    {
      title: "7. Delivery",
      content:
        'Delivery times are estimates. Delivery areas may be limited. Risk transfers to you after delivery.',
    },
    {
      title: "8. User Conduct",
      content:
        'You agree not to misuse the app or engage in fraudulent activities.',
    },
    {
      title: "9. Intellectual Property",
      content:
        'All app content is owned by Apni Farming and cannot be copied or distributed without permission.',
    },
    {
      title: "10. Privacy",
      content:
        'Your use is governed by our Privacy Policy.',
    },
    {
      title: "11. Disclaimers and Limitation of Liability",
      content:
        'The App is provided "as is". We are not liable for indirect damages. Fresh products may vary naturally.',
    },
    {
      title: "12. Termination",
      content:
        'We may suspend or terminate your access if you violate these Terms.',
    },
    {
      title: "13. Changes to Terms",
      content:
        'We may update these Terms and notify you. Continued use means acceptance.',
    },
    {
      title: "14. Governing Law and Dispute Resolution",
      content:
        'These Terms are governed by the laws of your jurisdiction. Disputes will be resolved in local courts.',
    },
    {
      title: "15. Contact Us",
      content:
        'For questions, contact us at apnifarmingt20@gmail.com or call +91-6306371889.',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-300 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900 ml-4">
          Terms & Conditions
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map(({ title, content }, index) => (
          <View key={index} style={{ marginBottom: SECTION_SPACING }}>
            <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
            <Text className="text-base leading-7 text-gray-700">{content}</Text>
            {index !== sections.length - 1 && (
              <View className="border-b border-gray-300 mt-4" />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;
