import { useState, useEffect } from "react";
import "./App.css";
import BeatsList from "./beatslist";
import Nav from "./nav"
import Search from "./searchcomponent"
import {authService, dbService} from "./fbase"


export default function SearchPage( {userObj, profileInfo}) {
  const[results,setResults] = useState([])

  useEffect(()=>{
    var data = []
    dbService.collection("audios").limit(10).get()
    .then((snapshot)=>{
      snapshot.forEach((audioDoc)=>{
        const authorID=audioDoc.data().authorID
        dbService
        .collection("users")
        .doc(authorID)
        .get()
        .then((userDoc)=>{
          let author = userDoc.data().username
          const finalData={
            id : audioDoc.data().id,
            genre : audioDoc.data().genre,
            name : audioDoc.data().name,
            author : author,
            likes : audioDoc.data().likes,
            url : audioDoc.data().url,
            key : audioDoc.data().key,
            scale : audioDoc.data().scale,
            bpm : audioDoc.data().bpm,
            }
          data = ([...data,finalData])
          setResults(data)
         });
      })
    })
  },[])

  
  return (
    <div className="App">
      <Search setResults={setResults}/>
      <br/><br/>

      <BeatsList results={results} setResults={setResults} profileInfo={profileInfo}/>
    </div>
  );
}

