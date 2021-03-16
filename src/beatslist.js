import { useState } from 'react';
import './App.css';
import AudioPlayer from './audioPlayer'

const data = [
    {
        url:'kaira.mp3',
        name: "Travis Scott Type Beat Hehe",
        author: "BeatCook",
    },
    {
        url:'garnules2.wav',
        name: "Flume ka chautha beta",
        author: "paani m aag",
    },
]

function BeatsList( {results} ) {
    // const[songData,setSongData]=useState(data)

    // const handleAdd = () => {
    //     setSongData([...songData,
    //         {
    //             url:'garnules2.wav',
    //             name: "mere baare",
    //             author: "teesriduni7a",
    //         }
    //     ])
    // }

    const player = results.map((item,index)=>{
        return(
            <AudioPlayer 
            key={index}
            url={item.url} 
            name={item.name}
            author={item.author}
            genre={item.genre}
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
