import { useState, useEffect } from "react";
import "./App.css";
import BeatsList from "./beatslist";
import Nav from "./nav"
import Search from "./searchcomponent"
import {authService, dbService} from "./fbase"


export default function SearchPage( {userObj}) {
  const[results,setResults] = useState([])

  useEffect(()=>{
    var data = []
    dbService.collection("audios").limit(10).get()
    .then((snapshot)=>{
      snapshot.forEach((audioDoc)=>{
        const authorID=audioDoc.data().authorID
        console.log()
        let author = ''
        dbService.collection("users").doc(authorID).get().then((userDoc)=>{
          author = userDoc.data().username
          const finalData={
            genre : audioDoc.data().genre,
            name : audioDoc.data().name,
            author : author,
            likes : audioDoc.data().likes,
            url : audioDoc.data().url
            }
          data = ([...data,finalData])
          setResults(data)

         })
         

      })
      console.log(data);
    })
  },[])

  return (
    <div className="App">
      <Search />
      <br/><br/>

      <BeatsList results={results}/>
    </div>
  );
}

