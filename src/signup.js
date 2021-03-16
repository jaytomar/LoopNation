import { useState, useEffect } from "react";
import "./App.css";
import { dbService } from "./fbase";
import {
  BrowserRouter as Router,
  Redirect,
  useHistory,
} from "react-router-dom";

function SignUp({ userObj, setIsNewUser, setProfileInfo }) {
  let history = useHistory();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const handleDisplayName = (e) => {
    e.preventDefault();
    setDisplayName(e.target.value);
  };
  const handleUsername = (e) => {
    e.preventDefault();

    setUsername(e.target.value);
  };
  const handleBio = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  };

  const onSubmit = (e) => {
    const data = {
      username: username,
      displayName: displayName,
      bio: bio,
    };
    e.preventDefault();
    const docRef = dbService.collection("users").doc(userObj.user.uid);
    const usernameRef = dbService
      .collection("users")
      .where("username", "==", username);

    usernameRef.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        docRef.set(data).then(() => {
          setIsNewUser(false);
          setProfileInfo(data);
          console.log("Document successfully written!");
          history.push("/");
        });
      } else {
        console.log("doc already exists");
      }
    });
  };

  return (
    <>
      <form action="" className="signup-form">
        <label htmlFor="">Display Name</label>
        <input type="text" onChange={handleDisplayName} value={displayName} />
        <br />
        <label htmlFor="">Username</label>
        <input type="text" onChange={handleUsername} value={username} />
        <br />
        <p>{"www." + window.location.hostname + ".com/" + username}</p>
        <br />
        <label htmlFor="">Bio</label>
        <input type="text" onChange={handleBio} value={bio} />
        <br />
        <input
          type="submit"
          value="submit"
          className="purple-btn"
          onClick={onSubmit}
        />
      </form>
    </>
  );
}

export default SignUp;
