/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {useEffect , useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Platform } from 'react-native';


const App = () => {
  const [isPermissionAndroidOK, setisPermissionAndroidOK] = useState(false)

  useEffect(() => {

    if (Platform.Version >= 23) {
      console.log('Running on Nougat!');
      setisPermissionAndroidOK(true);
      requestCameraPermission();
    }
    console.log("5555");
    return () => {
      
    }
  }, [])


  const requestCameraPermission =  async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          'title': 'INBODY App Location Permission',
          'message': 'INBODY App needs access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Location")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  return(
    <View style = {{flex : 1 ,justifyContent : 'center' ,alignItems : 'center'}}>
      <Text>{isPermissionAndroidOK ? "ok" : "bad"}</Text>
      
    </View>
  )
}

export default App;
