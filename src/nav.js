import "./App.css";
import ProfileButton from './profilebutton'
import firebaseInstance, {authService} from './fbase'
import {BrowserRouter as Router, Redirect, useHistory} from "react-router-dom"
import { useState } from "react";

export default function Nav({isLoggedIn, profileInfo, setIsNewUser, setProfileInfo}) {
  
  const[isLoggedOut, setIsLoggedOut] = useState(false)

    const handleLogin = () => {
        var provider = new firebaseInstance.auth.GoogleAuthProvider();
        authService.signInWithPopup(provider)
        .then((result) => {
          if(result.additionalUserInfo.isNewUser){
            setIsNewUser(true)
          }
          else{
            setIsNewUser(false)
          }
        })
      
    }

    const onLogOut = e => {
      authService.signOut().then(()=>{
        console.log("sign out successful");
        setProfileInfo(false)
        setIsLoggedOut(true)
      })
    }

    console.log(process.env.PUBLIC_URL);
  return (
      <nav>
        <a href={`${process.env.PUBLIC_URL}/`}>
          <img src={process.env.PUBLIC_URL + "/loopnation logo-01.png"} alt=""/>
        </a>
        <div className="nav-btns">
        <a href={`${process.env.PUBLIC_URL}/upload`}>upload</a>
        {profileInfo &&
            <ProfileButton profileInfo={profileInfo}/>
        }
        {isLoggedIn ?
            <button className="sign-in-btn" onClick={onLogOut}>logout</button>
            :
            <button className="sign-in-btn" onClick={handleLogin}>login</button>
        }
        {isLoggedOut &&
          <Router basename="/LoopNation">
            <Redirect to="/"/>
          </Router>
        }
        </div>
      </nav>
  );
}
