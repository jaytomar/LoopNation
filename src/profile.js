import { useState, useEffect } from "react";
import "./App.css";
import BeatsList from "./beatslist";
import EditProfileComponent from "./editprofilepopup";
import firebaseInstance, { authService, dbService } from "./fbase";
import { useParams } from "react-router-dom";

const Profile = ({ profileInfo, userObj }) => {
  const [profileData, setProfileData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [init, setInit] = useState(false);
  const [editProfilePopup, setEditProfilePopup] = useState(false);

  const { profile } = useParams();

  useEffect(() => {
    dbService
      .collection("users")
      .where("username", "==", profile)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setProfileData(userData);
          var data = [];
          dbService
            .collection("audios")
            .where("authorID", "==", userData.id)
            .get()
            .then((audio) => {
              audio.forEach((audioDoc) => {
                const finalData = {
                  id: audioDoc.data().id,
                  genre: audioDoc.data().genre,
                  name: audioDoc.data().name,
                  author: snapshot.docs[0].data().username,
                  likes: audioDoc.data().likes,
                  url: audioDoc.data().url,
                  key: audioDoc.data().key,
                  scale: audioDoc.data().scale,
                  bpm: audioDoc.data().bpm,
                };
                data = [...data, finalData];
              });
              setAudioData(data);
              setInit(true);
            });
        }
      });
  }, []);

  const onDisplayPictureChange = (e) => {
    const file = e.target.files[0];
    const size = file.size / 1024 / 1024;
    const fileName = file.name;
    var storageRef = firebaseInstance.storage().ref();

    console.log(fileName);
    console.log(size);
    if (profileData.coverFile != null) {
      var fileRef = storageRef.child(
        userObj.user.uid + "/picture/" + profileData.pictureFile
      );
      fileRef.delete().then(() => {
        console.log("file deleted");
      });
    }
    if (size < 5) {
      const reader = new FileReader();
      reader.onload = (finish) => {
        const imageRef = storageRef.child(
          userObj.user.uid + "/picture/" + fileName
        );
        var uploadTask = imageRef.putString(reader.result, "data_url");
        uploadTask.then(() => {
          imageRef.getDownloadURL().then((value) => {
            dbService
              .collection("users")
              .doc(userObj.user.uid)
              .update("picture", value);
            setProfileData({
              ...profileData,
              picture: value,
              pictureFile: fileName,
            });
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onCoverChange = (e) => {
    const file = e.target.files[0];
    const size = file.size / 1024 / 1024;
    const fileName = file.name;
    var storageRef = firebaseInstance.storage().ref();

    console.log(fileName);
    console.log(size);
    if (profileData.coverFile != null) {
      var fileRef = storageRef.child(
        userObj.user.uid + "/cover/" + profileData.coverFile
      );
      fileRef.delete().then(() => {
        console.log("file deleted");
      });
    }
    if (size < 5) {
      const reader = new FileReader();
      reader.onload = (finish) => {
        const imageRef = storageRef.child(
          userObj.user.uid + "/cover/" + fileName
        );
        var uploadTask = imageRef.putString(reader.result, "data_url");
        uploadTask.then(() => {
          imageRef.getDownloadURL().then((value) => {
            dbService.collection("users").doc(userObj.user.uid).update({
              cover: value,
              coverFile: fileName,
            });
            setProfileData({
              ...profileData,
              cover: value,
              coverFile: fileName,
            });
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onEditProfile = (e) => {
    setEditProfilePopup(!editProfilePopup);
  };

  console.log(init);
  return (
    <>
      {init && (
        <>
          {editProfilePopup && (
            <>
              <EditProfileComponent 
              userObj={userObj} 
              profileData={profileData} 
              setProfileData={setProfileData}
              setEditProfilePopup={setEditProfilePopup}
              />
            </>
          )}
          <div className="profile-page">
            <header className="header">
              <div className="profile-elements">
                {profileInfo.username == profileData.username ? (
                  <>
                    <div className="image-container">
                      <label class="overlay">
                        Change Picture
                        <input
                          type="file"
                          name="audio-upload"
                          accept="image/jpeg,image/x-png"
                          className="audio-upload"
                          onChange={onDisplayPictureChange}
                        />
                      </label>
                      <img
                        src={profileData.picture || "/generic-dp.png"}
                        alt=""
                        className="img-hover"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="image-container">
                      <img
                        src={profileData.picture || "/generic-dp.png"}
                        alt=""
                        className="img-hover"
                      />
                    </div>
                  </>
                )}
                <div className="profile-text">
                  <h3>{profileData.displayName}</h3>
                </div>
                <div className="profile-text">
                  <p>{profileData.bio}</p>
                </div>
              </div>
              {profileInfo.username == profileData.username ? (
                <div className="cover-container">
                  <div className="cover-overlay">
                    <label>
                      Change Cover
                      <input
                        type="file"
                        name="audio-upload"
                        accept="image/jpeg,image/x-png"
                        className="audio-upload"
                        onChange={onCoverChange}
                      />
                    </label>
                    <label>
                      Edit Profile
                      <button onClick={onEditProfile}></button>
                    </label>
                  </div>
                  <img className="img-hover" src={profileData.cover} />
                </div>
              ) : (
                <div className="cover-container">
                  <img
                    className="img-hover"
                    src={profileData.cover||"/loopnation-cover.png"}
                  />
                </div>
              )}
            </header>
          </div>
          <div className="audio-page">
            <BeatsList
              results={audioData}
              setResults={setAudioData}
              profileInfo={profileInfo}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
