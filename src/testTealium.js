import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Tealium from 'tealium-react-native';
import {
  TealiumView,
  TealiumEvent,
  ConsentCategories,
  Dispatchers,
  Collectors,
  ConsentPolicy,
  Expiry,
  ConsentStatus,
  TealiumEnvironment,
} from 'tealium-react-native/common';
import FirebaseConfig from './utilities/firebaseConfig';
const TestTealium = () => {
  const [initialized, setnitialized] = useState(false);
  useEffect(() => {
    tealiumConfig();
    return () => {};
  }, []);

  const tealiumConfig = () => {
    let config = {
      account: 'etisalatmisr',
      profile: 'main',
      environment: TealiumEnvironment.prod,
      dispatchers: [
        Dispatchers.Collect,
        Dispatchers.TagManagement,
        Dispatchers.RemoteCommands,
      ],
      collectors: [
        Collectors.AppData,
        Collectors.DeviceData,
        Collectors.Lifecycle,
        Collectors.Connectivity,
      ],
      lifecycleAutotrackingEnabled: true,
      consentLoggingEnabled: true,
      consentExpiry: {
        time: 10,
        unit: 'days',
      },
      consentPolicy: ConsentPolicy.gdpr,
      batchingEnabled: false,
      visitorServiceEnabled: true,
      useRemoteLibrarySettings: false,
    };
    Tealium.initialize(config, success => {
      if (!success) {
        console.log('Tealium not initialized');
        return;
      }
      console.log('Tealium initialized');
      Tealium.setConsentStatus(ConsentStatus.consented);
      Tealium.addRemoteCommand('hello', payload => {
        console.log('add remote', JSON.stringify(payload));
      });
    });
    Tealium.setVisitorServiceListener(profile => {
      //  console.log(JSON.stringify(profile['audiences']));
      // console.log(JSON.stringify(profile['tallies']));
      // console.log(JSON.stringify(profile['currentVisit']));
    });
    Tealium.setConsentExpiryListener(() => {
      console.log('Consent Expired');
    });
  };
  const trackEvent = () => {
    console.log('test event ');
    let event = new TealiumEvent('Test ', {
      event_name: 'test 1111',
      eventID: 'sdfsd',
    });
    Tealium.track(event);
  };
  const trackView = () => {
    console.log('test track view');
    let view = new TealiumView('Test View', {view_name: 'test'});
    Tealium.track(view);
  };
  const optIn = () => {
    console.log('opt in ');
    Tealium.setConsentStatus(ConsentStatus.consented);
  };
  const getConsentStatus = () => {
    Tealium.getConsentStatus(status => {
      console.log('Consent status: ' + status);
    });
  };
  const getConsentCategories = () => {
    Tealium.getConsentCategories(categories => {
      console.log('Consent categories: ' + categories);
    });
  };
  const resetConsent = () => {
    Tealium.setConsentStatus(ConsentStatus.unknown);
  };
  const setRandomConsentCategories = () => {
    let randomCategories = [
      ConsentCategories.bigData,
      ConsentCategories.mobile,
      ConsentCategories.social,
    ]
      .map(a => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value)
      .slice(0, 3);
    Tealium.setConsentCategories(randomCategories);
  };
  const addData = () => {
    console.log('local data');
    var data = new Map();
    data['testData'] = {user: 'User name 1', id: 'user id 1'};
    Tealium.addData(data, Expiry.session);
  };
  const getData = () => {
    Tealium.getData('testData', value => {
      console.log('testData: ' + value);
    });
  };
  const addRemoteCommand = () => {
    Tealium.addRemoteCommand('example', payload => {
      console.log('example command');
      console.log(JSON.stringify(payload));
    });
  };
  const getVisitorId = () => {
    Tealium.getSessionId(value => {
      console.log('Session id: ' + value);
      alert(`Visitor Id: ${value}`, [{text: 'OK', style: 'cancel'}]);
    });
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <FirebaseConfig />
      <View style={{flex: 1, backgroundColor: 'white', marginTop: 20}}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => trackEvent()}>
          <Text style={styles.textStyle}>TRACK EVENT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => trackView()}>
          <Text style={styles.textStyle}>TRACK VIEW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => optIn()}>
          <Text style={styles.textStyle}>OPT IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => getConsentStatus()}>
          <Text style={styles.textStyle}>GET CONSENT STATUS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => getConsentCategories()}>
          <Text style={styles.textStyle}>GET CONSENT CATEGORIES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => resetConsent()}>
          <Text style={styles.textStyle}>RESET CONSENT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setRandomConsentCategories()}>
          <Text style={styles.textStyle}>SET CONSENT CATEGORIES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => addData()}>
          <Text style={styles.textStyle}>ADD DATA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => getData()}>
          <Text style={styles.textStyle}>GET DATA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => addRemoteCommand()}>
          <Text style={styles.textStyle}>ADD REMOTE COMMAND</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => getVisitorId()}>
          <Text style={styles.textStyle}>GET VISITOR ID</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default TestTealium;
const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#007CC1',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 7,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.25,
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
  },
});
