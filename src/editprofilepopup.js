import { useState, useEffect } from "react";
import "./App.css";
import firebaseInstance, { authService, dbService } from "./fbase";
import { useParams } from "react-router-dom";

const EditProfileComponent = ({ userObj, profileData, setProfileData, setEditProfilePopup}) => {
  const [displayName, setDisplayName] = useState(profileData.displayName);
  const [bio, setBio] = useState(profileData.bio);

  const nameHandler = (e) => {
    e.preventDefault();
    setDisplayName(e.target.value);
  };

  const bioHandler = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      displayName: displayName,
      bio: bio,
    };
    dbService.collection("users").doc(userObj.user.uid)
    .update({displayName:displayName,bio:bio}).then(()=>{
      setProfileData({ ...profileData, ...data });

      setEditProfilePopup(false)
    })
    
  };

  const onClose = e => {
    e.preventDefault();
    setEditProfilePopup(false)
  }

  useEffect(() => {}, []);

  return (
    <>
      <div className="edit-profile-container">
        <form className="edit-profile-form">
        <button onClick={onClose}>
          <i className="fas fa-times-circle fa-2x"></i>
          </button>
          <h3>Edit Profile</h3>
          <br/>
          <label>
          Display Name :
          </label>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={nameHandler}
            />
          <br />
          <label>
          Bio : 
          </label>
          <textarea
            rows="5"
            cols="25"
            maxLength="150"
            placeholder="Bio"
            value={bio}
            onChange={bioHandler}
          />
          <br />
          <input
            type="submit"
            value="submit"
            className="purple-btn"
            onClick={onSubmit}
          />
        </form>
      </div>
    </>
  );
};

export default EditProfileComponent;
