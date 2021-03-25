import { useState } from "react";
import "./App.css";
import {dbService} from "./fbase"
export default function Search({setResults}) {

  const[searchQuery,setSearchQuery]=useState();
  const[genre,setGenre]=useState();


  const searchHandler = e => {
    setSearchQuery(e.target.value)
  }

  
  const genreHandler = e => {
    setGenre(e.target.value)
  }

  const onSearch = () => {
    const keywords = searchQuery.match(/\b[^\W]+\b/g);
    console.log(keywords);
    const searchRef = dbService.collection("audios")
    
    const query = searchRef.where("keywords", "array-contains-any", keywords).limit(10)

    query.get().then((snapshot)=>{
      var data = []

      snapshot.docs.forEach((audioDoc)=>{
        const authorID=audioDoc.data().authorID
        dbService.collection("users").doc(authorID).get().then((userDoc)=>{
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
         })
      })
    })
  }


  return (
      <div >
        <form action="" className="search-module ">
          <input type="text" className="search-bar shadow" placeholder="search" onChange={searchHandler}/>
          <div className="genre-select shadow">
            <select id="myList" name="genre" onChange={genreHandler}>
              <option value="none" selected disabled hidden>
                Genre
              </option>
              <option value="1">Trap</option>
              <option value="2">Hip-Hop</option>
              <option value="3">House</option>
              <option value="4">Jazz</option>
            </select>
          </div>
          <input className="submit-btn purple-btn shadow" type="button" value="search" onClick={onSearch}/>
        </form>
      </div>
  );
}

