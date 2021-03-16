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
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });
      
    }

    const onLogOut = e => {
      authService.signOut().then(()=>{
        console.log("sign out successful");
      })
    }

  return (
      <nav>
        <a href="/">
          <img src={process.env.PUBLIC_URL + "/loopnation logo-01.png"} alt=""/>
        </a>
        <div className="nav-btns">
        <a href="/upload">upload</a>
        {profileInfo ?
            <ProfileButton profileInfo={profileInfo}/>
            :
            <button onClick={handleLogin}>login</button>
        }
        {isLoggedIn &&

        <button onClick={onLogOut}>logout</button>
        }
        </div>
      </nav>
  );
}
