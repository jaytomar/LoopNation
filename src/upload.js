import { useState } from "react";
import "./App.css";
import firebaseInstance, { dbService } from "./fbase";
import AudioPlayer from "./audioPlayer";
import { uuid } from 'uuidv4';


export default function Upload({userObj,profileInfo}) {
    const[audio,setAudio]=useState(false);
    const[file,setFile] = useState();
    const[genre, setGenre] = useState("No Genre");
    const[title,setTitle] = useState('')
    const[fileError,setFileError]=useState(true)
    
    const selectionHandler = e => {
      console.log(e.target.value);
      setGenre(e.target.value)
    }
    
    const handeTitle = e => {
      e.preventDefault();
      setTitle(e.target.value)
    }
    
    const handleChange = (e) => {
        const {target:{files}} = e;
        const theFile=files[0]
        const fileSize = theFile.size/1024/1024
        console.log(fileSize);
        if (fileSize <= 10) {
          setFile(theFile)
          setTitle(theFile.name)
        }
        else{
          setFileError("file size must be less than 10MB")
        }
    }

    const onSubmit = e => {
      e.preventDefault()
      console.log(e.target);
      const reader = new FileReader();
        reader.fileName = file.name

        reader.onload = (finish) => {
            var storageRef = firebaseInstance.storage().ref();
            const audioref=storageRef.child("audios/"+finish.target.fileName);
            audioref.putString(reader.result, 'data_url')
            .then((snapshot) => {
              const id = uuid();
              audioref
              .getDownloadURL()
              .then((value)=>{
                const data = {
                  id : id,
                  url : value,
                  name : finish.target.fileName,
                  authorID : userObj.user.uid,
                  likes : 0,
                  genre : genre
                }
                dbService
                .collection("audios")
                .doc(id)
                .set(data)
                .then((result) => {
                  console.log(result);
                })
                console.log(value);
                setAudio(value)
              })
            });
        }
        reader.readAsDataURL(file);
    }
    return (
        <>
        {audio &&
        <> 
            <p>uploaded!</p>
            <AudioPlayer url={audio} name={file.name} author={profileInfo.username}/>
        </>
        }
    <form className="upload-form">
      <label class="custom-file-upload">
      <input type="file" name="audio-upload" id="" onChange={handleChange} className="audio-upload" value="" />
      Select File
      </label>

      {fileError &&
        <p>{fileError}</p>
      }
      <label htmlFor="">Title </label>
      <input type="text" value={title} onChange={handeTitle}/>
      <select id="myList" name="genre" onChange={selectionHandler}>
              <option value="none" selected disabled hidden>
                Genre
              </option>
              <option value="Trap">Trap</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="House">House</option>
              <option value="Jazz">Jazz</option>
            </select>
      <input type="submit" value="upload" onClick={onSubmit} className="purple-btn"/>
    </form>
    
    
    </>
  );
}
