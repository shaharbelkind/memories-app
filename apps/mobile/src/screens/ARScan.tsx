import React from 'react';
import { View, Text, Button } from 'react-native';
export default function ARScan(){
  return <View style={{padding:16}}>
    <Text style={{fontSize:22,fontWeight:'700'}}>Scan an Object (stub)</Text>
    <Text>Walk around the item and take 50–100 photos. Upload to link later.</Text>
    <Button title="Capture photos" onPress={()=>{}}/>
  </View>;
}
