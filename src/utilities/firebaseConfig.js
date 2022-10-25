import React, {useEffect} from 'react';
import {View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {TealiumEvent} from 'tealium-react-native/common';
import Tealium from 'tealium-react-native';

const FirebaseConfig = () => {
  useEffect(() => {
    // request user permission for notifications
    requestUserPermission();
    //  unsubscribe it's a firebase notification messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remote message  ', remoteMessage);
    });
    return unsubscribe;
  }, []);

  // ? getFcmToken
  // it's a function that gets the device token  from firebase messaging
  // then call sendToken to send device token to tealium with event
  const getFcmToken = async () => {
    // get device token
    const fcmToken = await messaging().getToken();
    // check if there is a token or not, if there invoke sendToken with  the  token as a  parameter
    if (fcmToken) {
      sendToken(fcmToken);
    }
  };

  // ? sendToken
  // it a function that is takes a device token as a parameter  then
  //  creates a Tealium event with a new field called deviceToken
  // witch has the  device token as a value
  const sendToken = deviceToken => {
    try {
      let event = new TealiumEvent('EtisalatMusic', {
        deviceToken,
      });
      console.log('event', event);
      Tealium.track(event);
    } catch ({response}) {
      console.log(response?.data);
    }
  };
  // ? requestUserPermission
  //  its a function that checked user permission for notification
  // if user approves permission it will invoke getFcmToken to get
  // user device token
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    } else {
      console.log("notification permission isn't approved");
    }
  };
  return <View />;
};

export default FirebaseConfig;
