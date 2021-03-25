import { useState } from "react";
import "./App.css";
import firebaseInstance, { dbService } from "./fbase";
import AudioPlayer from "./audioPlayer";
import BeatsList from "./beatslist"
import { uuid } from "uuidv4";

export default function Upload({ userObj, profileInfo, isLoggedIn}) {
  const [audio, setAudio] = useState(false);
  const [file, setFile] = useState();
  const [genre, setGenre] = useState("No Genre");
  const [key, setKey] = useState("No Key");
  const [scale, setScale] = useState("No Scale");
  const [BPM, setBPM] = useState("No BPM");
  const [title, setTitle] = useState("");
  const [fileError, setFileError] = useState(false);
  const [fileSelection, setFileSelection] = useState("Select File");
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(0);
  const [results,setResults]=useState([])
  const genreHandler = (e) => {
    setGenre(e.target.value);
  };

  const keyHandler = (e) => {
    setKey(e.target.value);
  };

  const BPMHandler = (e) => {
    setBPM(e.target.value);
  };

  const scaleHandler = (e) => {
    setScale(e.target.value);
  };

  const handeTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const fileSize = theFile.size / 1024 / 1024;
    console.log(fileSize);
    if (fileSize <= 10) {
      setFileError(false);
      setFile(theFile);
      setTitle(theFile.name);
      setFileSelection(theFile.name);
    } else {
      setFileError("file size must be less than 10MB");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    const reader = new FileReader();
    reader.fileName = file.name;

    reader.onload = (finish) => {
      var storageRef = firebaseInstance.storage().ref();
      const audioref = storageRef.child("audios/" + title);
      var uploadTask = audioref.putString(reader.result, "data_url");

      uploadTask.on("state_changed", (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setLoading(progress);
      });
      uploadTask.then((snapshot) => {
        const id = uuid();
        const keywords = title.match(/\b[^\W]+\b/g);
        const keywordsFiltered = keywords.map((value) => {
          return value.toLowerCase();
        });
        audioref.getDownloadURL().then((value) => {
          const data = {
            id: id,
            url: value,
            name: title,
            authorID: userObj.user.uid,
            likes: 0,
            genre: genre,
            key: key,
            scale: scale,
            bpm: BPM,
            keywords: keywordsFiltered,
          }
          const state = {...data,author:profileInfo.username}
          console.log(state);
          setResults([state])
          dbService
            .collection("audios")
            .doc(id)
            .set(data)
            .then((result) => {
              console.log(result);
            });
          setAudio(value);
          setIsUploaded(true);
        });
      });
    };
    reader.readAsDataURL(file);
  };
  return (
    <>
      {isLoggedIn ?
      (
        <div>
        <div className="audio-page">
          {audio && (
            <>
             <BeatsList results={results} setResults={setResults} profileInfo={profileInfo}/>
            </>
          )}
        </div>
        <form className="upload-form">
          {!isUploaded && (
            <label class="custom-file-upload">
              <input
                type="file"
                name="audio-upload"
                accept="audio/*"
                onChange={handleChange}
                className="audio-upload"
                value=""
              />
              {fileSelection}
            </label>
          )}
          {fileError && <p>{fileError}</p>}
          <div className="progress-bar">
            <div className="filler" style={{ width: loading + "%" }}></div>
          </div>
          <br />
          <input
            type="text"
            value={title}
            onChange={handeTitle}
            placeholder="Title"
          />
          <div className="two-column-form">
          <input type="number" placeholder="BPM" onChange={BPMHandler} />
          <select name="genre" onChange={genreHandler}>
            <option value="none" selected disabled hidden>
              Genre
            </option>
            <option value="Trap">Trap</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="House">House</option>
            <option value="Jazz">Jazz</option>
          </select>
          </div>
          <select name="key" onChange={keyHandler}>
            <option value="key" selected disabled hidden>
              Key
            </option>
            <option value="C">C</option>
            <option value="C#">C#</option>
            <option value="D">D</option>
            <option value="D#">D#</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="F#">F#</option>
            <option value="G">G</option>
            <option value="G#">G#</option>
            <option value="A">A</option>
            <option value="A#">A#</option>
            <option value="B">B</option>
          </select>
          <select name="scale" id="" onChange={scaleHandler}>
            <option value="scale" selected disabled hidden>
              Scale
            </option>
            <option value="">Major</option>
            <option value="m">Minor</option>
          </select>
          {!isUploaded && (
            <input
              type="submit"
              value="upload"
              onClick={onSubmit}
              className="purple-btn"
            />
          )}
        </form>
      </div>
      )
      :
      (
          <div className="upload-form">
            <p className="center-text">please log in to upload</p>
          </div>
      )

      }
    </>
  );
}
