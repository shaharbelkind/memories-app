import React from 'react';
import { View, Text, Button } from 'react-native';
export default function VoiceNote(){
  return <View style={{padding:16}}>
    <Text style={{fontSize:22,fontWeight:'700'}}>Record a short story</Text>
    <Button title="Record" onPress={()=>{}}/>
  </View>;
}
