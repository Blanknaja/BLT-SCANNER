/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isPermissionAndroidOK, setisPermissionAndroidOK] = useState(false);

  useEffect(() => {
    if (Platform.Version >= 23) {
      setisPermissionAndroidOK(true);
      requestLocationPermission();
      BleManager.start({showAlert: false}).then(() => {
        // Success code
        console.log('Module initialized');
      });

      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );

      scanDevice();
    }
    return () => {
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral');
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral) => {
    console.log("peripheral " ,peripheral)
    console.log('peripheral name ', peripheral.name);
    console.log('peripheral id ', peripheral.id);

    if (peripheral.id == '73:E5:12:5F:CB:E8') {
      BleManager.stopScan();

      BleManager.connect('73:E5:12:5F:CB:E8')
        .then(() => {
          // Success code
          console.log('Connected');
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });

        BleManager.retrieveServices("73:E5:12:5F:CB:E8").then(
          (peripheralInfo) => {
            // Success code
            console.log("Peripheral info:", peripheralInfo);
          }
        );
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'INBODY App Location Permission',
          message: 'INBODY App needs access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const scanBle = () => {
    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch((error) => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
  };

  const scanDevice = () => {
    BleManager.scan([], 30);

    // DE:35:57:84:DF:AFz

    //   BleManager.connect("40:5E:77:BE:D4:12")
    // .then(() => {
    //   // Success code
    //   console.log("Connected");
    // })
    // .catch((error) => {
    //   // Failure code
    //   console.log(error);
    // });
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{isPermissionAndroidOK ? 'ok' : 'bad'}</Text>
      <Button title="SCAN" onPress={scanBle} />
    </View>
  );
};

export default App;
