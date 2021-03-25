import { useState,useEffect } from 'react';
import { dbService } from "./fbase";
import './App.css';
import AudioPlayer from './audioPlayer'



function BeatsList( {results, setResults, profileInfo} ) {
    
    
    const [likesArray, setLikesArray] = useState([]);
    
    useEffect(()=>{
        console.log("useEffect");
        console.log(profileInfo);
        if(profileInfo){

            var likesRef = dbService.collection("likes").doc(profileInfo.username);
            
            likesRef.get().then((snapshot) => {
                if (snapshot.exists) {
                    setLikesArray(snapshot.data().likes);
                }
            });
        }
        },[])
        console.log(results);
    const player = results.map((item,index)=>{
        return(
            <AudioPlayer 
            id={item.id}
            key={index}
            index={index}
            url={item.url} 
            name={item.name}
            author={item.author}
            genre={item.genre}
            audioKey={item.key}
            bpm = {item.bpm}
            likes={item.likes}
            audioData={results}
            setAudioData={setResults}
            profileInfo={profileInfo}
            likesArray = {likesArray}
            setLikesArray = {setLikesArray}
            liked = {likesArray.includes(item.id)}
            />
        )
    })

    return (
        <>  

            <div className="audio-page">
                {results &&
                    player
                }
            </div>

        </>
    );
}

export default BeatsList;
