import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function RootLayout() {

  const router = useRouter();
  const [ready,setReady] = useState(false);

  useEffect(()=>{

    const init = async () => {

      try{

        const topics = await AsyncStorage.getItem("userTopics");

        if(!topics){

          setTimeout(()=>{
            router.push("/topics");
          },100);

        }

      }catch(e){
        console.log(e);
      }

      setReady(true);

    };

    init();

  },[]);

  if(!ready){

    return(
      <View style={{
        flex:1,
        backgroundColor:"#121212",
        alignItems:"center",
        justifyContent:"center"
      }}>
        <ActivityIndicator size="large" color="#fff"/>
      </View>
    )

  }

  return (
    <Stack screenOptions={{ headerShown:false }} />
  );

}