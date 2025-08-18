// components/InfoModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function InfoModal({ 
  visible, 
  onClose, 
  title, 
  messageEn,   // English message
  messageHi,   // Hindi message
  animationSource
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.topClose} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={wp(6)} color="#333" />
          </TouchableOpacity>

          {/* Animation */}
          {animationSource && (
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
            />
          )}

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* English Message */}
          {messageEn && <Text style={styles.subText}>{messageEn}</Text>}

          {/* Hindi Message */}
          {messageHi && <Text style={styles.subTextHindi}>{messageHi}</Text>}

          {/* Action Button */}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: 'center',
    width: wp(85),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  topClose: {
    position: 'absolute',
    top: hp(1.5),
    right: wp(3),
    zIndex: 10,
  },
  animation: {
    width: wp(50),
    height: wp(50),
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(5),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp(1),
    color: '#333',
  },
  subText: {
    fontSize: wp(4),
    textAlign: 'center',
    color: '#555',
    marginBottom: hp(1),
  },
  subTextHindi: {
    fontSize: wp(4),
    textAlign: 'center',
    color: '#ff5722',
    fontWeight: '600',
    marginBottom: hp(2),
  },
  closeButton: {
    backgroundColor: '#ff7043',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    borderRadius: wp(3),
    marginTop: hp(1),
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
});
