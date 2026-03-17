import React, { useState } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function TopicsScreen(){

const router = useRouter();

const topics = [
"AI",
"Technology",
"Business & Startups",
"Markets & Crypto",
"Geopolitics",
"Energy",
"Climate",
"Science"
];

const [selected,setSelected] = useState([]);

const toggleTopic = (topic) => {

if(selected.includes(topic)){

setSelected(selected.filter(t => t !== topic));

}else{

setSelected([...selected,topic]);

}

};

const saveTopics = async () => {

await AsyncStorage.setItem(
"userTopics",
JSON.stringify(selected)
);

router.replace("/(tabs)");

};

return(

<View style={styles.container}>

<Text style={styles.title}>
Choose your interests
</Text>

<ScrollView>

{topics.map(topic => (

<TouchableOpacity
key={topic}
style={[
styles.topic,
selected.includes(topic) && styles.topicSelected
]}
onPress={()=>toggleTopic(topic)}
>

<Text style={styles.topicText}>
{topic}
</Text>

</TouchableOpacity>

))}

</ScrollView>

<TouchableOpacity
style={styles.button}
onPress={saveTopics}
>

<Text style={styles.buttonText}>
Continue
</Text>

</TouchableOpacity>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#121212",
paddingTop:80,
paddingHorizontal:20
},

title:{
color:"#fff",
fontSize:26,
fontWeight:"bold",
marginBottom:30
},

topic:{
backgroundColor:"#2a2a2a",
padding:16,
borderRadius:10,
marginBottom:12
},

topicSelected:{
backgroundColor:"#ffffff"
},

topicText:{
color:"#fff",
fontSize:16
},

button:{
backgroundColor:"#fff",
padding:16,
borderRadius:10,
marginTop:20
},

buttonText:{
textAlign:"center",
fontWeight:"bold"
}

});