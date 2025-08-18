import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import CartIconWithBadge from '../components/Carticon';
import useAuthStore from '../Store/AuthStore';
import Back from '../components/Back';
import ProfileIcon from '../components/ProfileIcon';
import { Colors } from '../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Utility to scale font size based on screen size
const scaleFont = (size) => size * PixelRatio.getFontScale();

export default function PageNotFound() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      {/* Header */}
      <View style={{ marginBottom: height * 0.005 }}>
        <View style={styles.header}>
          <Back title="404" />
          <View style={styles.headerIcons}>
            <CartIconWithBadge />
            {isLoggedIn() && <ProfileIcon />}
          </View>
        </View>
      </View>

      {/* Lottie Animation + Text */}
      <View style={styles.center}>
        <LottieView
          source={require('../assets/animations/Page Not Found 404.json')}
          autoPlay
          loop
          style={{
            width: width * 0.85, // 70% of screen width
            height: width * 0.85,
          }}
        />
        <Text style={[styles.title, { fontSize: scaleFont(22) }]}>
          Oops! Page Not Found
        </Text>
        <Text style={[styles.subtitle, { fontSize: scaleFont(16) }]}>
          The page you are looking for doesn’t exist or has been moved.
        </Text>

        <TouchableOpacity
          style={[styles.button, { paddingVertical: height * 0.015, paddingHorizontal: width * 0.08 }]}
          onPress={() => router.replace('/home')}
        >
          <Text style={[styles.buttonText, { fontSize: scaleFont(16) }]}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    marginVertical: height * 0.015,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontWeight: 'bold',
    color: 'red',
    marginTop: height * 0.02,
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    textAlign: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
