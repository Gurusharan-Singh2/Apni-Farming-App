import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function ZipCodeNotServiceableModal({ visible, onClose, message }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.topClose} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={wp(6)} color="black" />
          </TouchableOpacity>

          {/* Lottie Animation */}
          <LottieView
            source={require('../assets/animations/Delivery guy.json')}
            autoPlay
            loop
            style={styles.animation}
          />

          {/* Main Message */}
          <Text style={styles.title}>This pincode is not serviceable</Text>
          <Text style={styles.subText}>
            Sorry for the inconvenience — we’re coming to your address soon!
          </Text>

          {/* Supported ZIP Codes */}
          <Text style={styles.supportedTitle}>You can try one of these supported ZIP codes:</Text>
          <FlatList
            data={message}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.zipCodeItem}>
                <Text style={styles.zipCode}>{item}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(4),
    padding: wp(5),
    alignItems: 'center',
    width: wp(85),
  },
  topClose: {
    position: 'absolute',
    top: hp(1.5),
    right: wp(3),
  },
  animation: {
    width: wp(60),
    height: wp(60),
   
  },
  title: {
    fontSize: wp(4.5),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: hp(0.8),
    color: '#333',
  },
  subText: {
    fontSize: wp(3.5),
    textAlign: 'center',
    color: '#555',
    marginBottom: hp(1.5),
  },
  supportedTitle: {
    fontSize: wp(3.7),
    fontWeight: '600',
    color: '#444',
    marginBottom: hp(1),
  },
  zipCodeItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
  },
  zipCode: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#ff6600',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    marginTop: hp(2),
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(3.7),
  },
});
