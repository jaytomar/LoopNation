import { useState, useEffect } from "react";
import "./App.css";
import Upload from "./upload"
import Nav from "./nav"
import SignUp from './signup'
import SearchPage from "./searchpage"
import AudioPage from "./audiopage"
import Profile from "./profile"
import {authService, dbService} from "./fbase"
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const[isLoggedIn,setIsLoggedIn]=useState(false)
  const[userObj,setUserObj]=useState([])
  const[profileInfo,setProfileInfo] = useState(false)
  const[isNewUser, setIsNewUser]=useState(false)
  const[init, setInit] = useState(false)

  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        setUserObj({user})
        setIsLoggedIn(true);
        var userRef = dbService.collection("users").doc(user.uid)
        userRef.get().then(doc=>{
          setProfileInfo(doc.data())
          setInit(true)
        })
      }
      else{
        setIsLoggedIn(false);
        setInit(true)
      }
      
    })
  },[])


  return (
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} profileInfo={profileInfo} setIsNewUser={setIsNewUser}/>
      <br/><br/>
      {init &&

        <Router>
        <Switch>
          <Route exact path="/">
            <SearchPage profileInfo={profileInfo}/>
          </Route>
          <Route path="/upload">
            <Upload userObj={userObj} profileInfo={profileInfo} isLoggedIn={isLoggedIn}/>
          </Route>
          <Route path="/sign-up">
            <SignUp userObj={userObj} isNewUser={isNewUser} setIsNewUser={setIsNewUser} setProfileInfo={setProfileInfo}/>
          </Route>
          <Route exact path="/:profile">
            <Profile userObj={userObj} profileInfo={profileInfo} isLoggedIn={isLoggedIn} setProfileInfo={setProfileInfo}/>
          </Route>
          <Route path="/:userName/:songID">
            <AudioPage profileInfo={profileInfo}/>
          </Route>
        </Switch>
        {isNewUser &&
          <>
            <Redirect to='/LoopNation/#/sign-up' />
          </>
        }
      </Router>
      }
      
    </div>
  );
}

export default App;
