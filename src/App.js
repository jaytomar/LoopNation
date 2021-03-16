import { useState, useEffect } from "react";
import "./App.css";
import Upload from "./upload"
import Nav from "./nav"
import SignUp from './signup'
import SearchPage from "./searchpage"
import {authService, dbService} from "./fbase"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const[isLoggedIn,setIsLoggedIn]=useState(false)
  const[userObj,setUserObj]=useState([])
  const[profileInfo,setProfileInfo] = useState(false)
  const[isNewUser, setIsNewUser]=useState(false);

  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        setUserObj({user})
        setIsLoggedIn(true);
        var userRef = dbService.collection("users").doc(user.uid)
        userRef.get().then(doc=>{
          setProfileInfo(doc.data())
        })
      }
      else{
        setIsLoggedIn(false);
      }
    })
  },[])


  return (
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} profileInfo={profileInfo} setIsNewUser={setIsNewUser}/>
      <br/><br/>
      <br/><br/>

      <Router>
        <Switch>
          <Route exact path="/">
            <SearchPage/>
          </Route>
          <Route path="/upload">
            <Upload userObj={userObj} profileInfo={profileInfo}/>
          </Route>
          <Route path="/sign-up">
            <SignUp userObj={userObj} isNewUser={isNewUser} setIsNewUser={setIsNewUser} setProfileInfo={setProfileInfo}/>
          </Route>
 
        </Switch>
        {isNewUser &&
          <>
            <Redirect to='/sign-up' />
          </>
        }
      </Router>
      
    </div>
  );
}

export default App;
