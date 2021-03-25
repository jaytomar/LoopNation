import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./App.css";
import AudioPlayer from "./audioPlayer";
import BeatsList from "./beatslist";
import { dbService } from "./fbase";

export default function AudioPage({ profileInfo }) {
  const [results, setResults] = useState(false);

  const { userName, songID } = useParams();

  useEffect(() => {
    dbService
      .collection("audios")
      .doc(songID)
      .get()
      .then((snapshot) => {
        dbService
          .collection("users")
          .where("username", "==", userName)
          .get()
          .then((userDoc) => {
            if (!userDoc.empty) {
              let author = userDoc.docs[0].data().username;
              const finalData = {
                id: snapshot.data().id,
                genre: snapshot.data().genre,
                name: snapshot.data().name,
                author: author,
                likes: snapshot.data().likes,
                url: snapshot.data().url,
                key: snapshot.data().key,
                scale: snapshot.data().scale,
                bpm: snapshot.data().bpm,
              };

              setResults([finalData]);
            }
          });
      });
  }, []);

  console.log(results);
  return (
    <div className="audio-page">
      {results && (
        <BeatsList
          results={results}
          setResults={setResults}
          profileInfo={profileInfo}
        />
      )}
    </div>
  );
}
