import React from 'react';
import {SafeAreaView} from 'react-native';

import TestTealium from './src/testTealium';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <TestTealium />
    </SafeAreaView>
  );
};

export default App;
