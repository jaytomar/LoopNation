import "./App.css";
import ProfileButton from './profilebutton'
import firebaseInstance, {authService} from './fbase'
import {BrowserRouter as Router, Link} from "react-router-dom"

export default function Nav({isLoggedIn, profileInfo, setIsNewUser}) {
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
      })
    }

  return (
      <nav>
        <a href="/LoopNation/#/">
          <img src={process.env.PUBLIC_URL + "/loopnation logo-01.png"} alt=""/>
        </a>
        <div className="nav-btns">
        <a href="/LoopNation/#/upload">upload</a>
        {profileInfo &&
            <ProfileButton profileInfo={profileInfo}/>
        }
        {isLoggedIn ?
            <button className="sign-in-btn" onClick={onLogOut}>logout</button>
            :
            <button className="sign-in-btn" onClick={handleLogin}>login</button>
        }

        </div>
      </nav>
  );
}
