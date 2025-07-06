// firebaseConfig.js
import firebase from '@react-native-firebase/app';

if (!firebase.apps.length) {
  firebase.initializeApp(); // No config needed if using google-services.json
}

export default firebase;
