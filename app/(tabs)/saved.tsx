import React, { useState, useCallback } from "react";
import {
View,
Text,
FlatList,
Image,
TouchableOpacity,
Linking,
StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function SavedScreen(){

const [articles,setArticles]=useState([]);

useFocusEffect(
useCallback(()=>{
loadSaved();
},[])
);

const loadSaved=async()=>{

const stored=await AsyncStorage.getItem("savedArticles");

if(stored){
setArticles(JSON.parse(stored));
}else{
setArticles([]);
}

};

const renderItem=({item})=>(

<TouchableOpacity onPress={()=>Linking.openURL(item.url)}>

<View style={styles.card}>

{item.urlToImage&&(
<Image source={{uri:item.urlToImage}} style={styles.image}/>
)}

<View style={styles.textContainer}>

<Text style={styles.title}>{item.title}</Text>

<Text style={styles.source}>{item.source.name}</Text>

</View>

</View>

</TouchableOpacity>

);

return(

<View style={styles.container}>

<Text style={styles.header}>Saved Articles</Text>

<FlatList
data={articles}
keyExtractor={(item,index)=>index.toString()}
renderItem={renderItem}
/>

</View>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
paddingTop:50,
backgroundColor:"#121212"
},

header:{
fontSize:24,
fontWeight:"bold",
textAlign:"center",
marginBottom:20,
color:"#fff"
},

card:{
flexDirection:"row",
marginHorizontal:15,
marginBottom:18
},

image:{
width:120,
height:90,
borderRadius:10
},

textContainer:{
flex:1,
paddingLeft:10,
justifyContent:"center"
},

title:{
fontSize:16,
fontWeight:"600",
color:"#fff"
},

source:{
color:"#aaa",
marginTop:4
}

});