import React, { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
Image,
TouchableOpacity,
Linking,
StyleSheet,
ScrollView
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen(){

const NEWS_API_KEY="168721271f7e4b20a90e85b0ad5e3e5a";

const AI_ENDPOINT="https://us-central1-verityn-news-app.cloudfunctions.net/summarizeNews";

const [articles,setArticles]=useState([]);
const [topStory,setTopStory]=useState(null);
const [summary,setSummary]=useState("");
const [loadingSummary,setLoadingSummary]=useState(false);
const [category,setCategory]=useState("general");
const [saved,setSaved]=useState([]);

const categories=["general","technology","business","science","sports"];

useEffect(()=>{
fetchNews();
loadSaved();
},[category]);

const fetchNews=async()=>{

const res=await axios.get(
`https://newsapi.org/v2/top-headlines?language=en&category=${category}&pageSize=20&apiKey=${NEWS_API_KEY}`
);

const top=res.data.articles[0];

setTopStory(top);
setArticles(res.data.articles.slice(1));

generateSummary(top);

};

const generateSummary=async(article)=>{

if(!article)return;

setLoadingSummary(true);

try{

const response=await axios.post(
AI_ENDPOINT,
{
title:article.title,
description:article.description
}
);

setSummary(response.data.summary);

}catch(error){

console.log(error);

}

setLoadingSummary(false);

};

const loadSaved=async()=>{

const stored=await AsyncStorage.getItem("savedArticles");

if(stored)setSaved(JSON.parse(stored));

};

const saveArticle=async(article)=>{

const exists=saved.find(a=>a.url===article.url);

if(exists)return;

const updated=[...saved,article];

setSaved(updated);

await AsyncStorage.setItem(
"savedArticles",
JSON.stringify(updated)
);

};

const timeAgo=(date)=>{

const diff=Date.now()-new Date(date);

const hours=Math.floor(diff/(1000*60*60));

if(hours<1)return"Just now";
if(hours<24)return hours+"h ago";

return Math.floor(hours/24)+"d ago";

};

const renderArticle=({item})=>(

<View style={styles.card}>

<TouchableOpacity
style={styles.cardContent}
onPress={()=>Linking.openURL(item.url)}
>

{item.urlToImage&&(
<Image source={{uri:item.urlToImage}} style={styles.image}/>
)}

<View style={styles.textContainer}>

<Text style={styles.title}>{item.title}</Text>

<Text style={styles.meta}>
{item.source.name} • {timeAgo(item.publishedAt)}
</Text>

</View>

</TouchableOpacity>

<TouchableOpacity
style={styles.bookmark}
onPress={()=>saveArticle(item)}
>

<Text style={{color:"#fff",fontSize:18}}>🔖</Text>

</TouchableOpacity>

</View>

);

return(

<View style={styles.container}>

<Text style={styles.header}>Verityn</Text>

{topStory&&(

<TouchableOpacity onPress={()=>Linking.openURL(topStory.url)}>

<View style={styles.topStoryCard}>

<Image
source={{uri:topStory.urlToImage}}
style={styles.topImage}
/>

<Text style={styles.topTitle}>{topStory.title}</Text>

<Text style={styles.meta}>
{topStory.source.name} • {timeAgo(topStory.publishedAt)}
</Text>

{loadingSummary&&(
<Text style={styles.summary}>Generating summary...</Text>
)}

{summary!==""&&(
<Text style={styles.summary}>{summary}</Text>
)}

</View>

</TouchableOpacity>

)}

<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
style={styles.categoryContainer}
>

{categories.map(cat=>(

<TouchableOpacity
key={cat}
style={[
styles.categoryButton,
category===cat&&styles.categoryActive
]}
onPress={()=>setCategory(cat)}
>

<Text
style={[
styles.categoryText,
category===cat&&{color:"#000"}
]}
>
{cat}
</Text>

</TouchableOpacity>

))}

</ScrollView>

<FlatList
data={articles}
keyExtractor={(item,index)=>index.toString()}
renderItem={renderArticle}
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
fontSize:28,
fontWeight:"bold",
textAlign:"center",
marginBottom:15,
color:"#fff"
},

topStoryCard:{
marginHorizontal:15,
marginBottom:20
},

topImage:{
width:"100%",
height:220,
borderRadius:12
},

topTitle:{
fontSize:20,
fontWeight:"700",
marginTop:10,
color:"#fff"
},

summary:{
marginTop:10,
color:"#ddd",
lineHeight:22
},

categoryContainer:{
paddingHorizontal:10,
marginBottom:10
},

categoryButton:{
paddingVertical:8,
paddingHorizontal:16,
backgroundColor:"#2a2a2a",
borderRadius:20,
marginRight:10
},

categoryActive:{
backgroundColor:"#fff"
},

categoryText:{
fontWeight:"600",
color:"#ccc"
},

card:{
flexDirection:"row",
marginHorizontal:15,
marginBottom:18,
alignItems:"center"
},

cardContent:{
flexDirection:"row",
flex:1
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

meta:{
color:"#aaa",
marginTop:4,
fontSize:12
},

bookmark:{
marginLeft:10
}

});