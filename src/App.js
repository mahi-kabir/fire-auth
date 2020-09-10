import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);


function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
   
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const SignedInUser = {
        isSignedIn : true,
        name: displayName,
        email: email,
        photo: photoURL
      }

      setUser(SignedInUser);

      console.log(displayName, email, photoURL);
    })

    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
    
    }

    const handleSignOut = () =>{
      firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email:'',
          password:'',
          error:'',
          isValid: false,
          existingUser:false
        }

        setUser(signedOutUser);
      })

      .catch(err =>{

      })
    }

    const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
    const hasNumber = input => /\d/.test(input);
    const switchForm = e =>{
     
      const createdUser  = {...user};
      createdUser.existingUser = e.target.checked;
      setUser(createdUser);
     }
    
    const handleChange = e =>{
      const newUserInfo ={
        ...user
      };

      //perform validation
      let isValid = true;
      if(e.target.name === 'email'){
        isValid = is_valid_email(e.target.value);
      }

      if(e.target.name === "password"){
        isValid = e.target.value.length>8 && hasNumber(e.target.value);

      } 

      console.log(e.target.name);

      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = isValid;
      //console.log(newUserInfo);
      setUser(newUserInfo);
    }
    const createAccount = (event) => {

        if(user.isValid){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res =>{
          console.log(res);
          const createdUser  = {...user};
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })

        .catch(err =>{
          console.log(err.message);
          const createdUser  = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
      }
      else{
        console.log('form is not valid', user);
      }

      event.preventDefault();
      event.target.reset();
    }

    const signInUser = event =>{
      if(user.isValid){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res =>{
          console.log(res);
          const createdUser  = {...user};
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })

        .catch(err =>{
          console.log(err.message);
          const createdUser  = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
      }
      event.preventDefault();
      event.target.reset();
    }

  
  return (
    <div className="App">
        
        {
          user.isSignedIn ? <button onClick = {handleSignOut}>Sign out</button>:
          <button onClick = {handleSignIn}>Sign in</button>
        }
        
        {
          user.isSignedIn && <div>
            <p>Welcome, {user.name}</p>
            <p>Email: {user.email}</p>
            <img src = {user.photo} alt =""></img>
          </div>
       

        }

        <h1>Our own Authentication</h1>
        <input type="checkBox" name = "switchForm" onChange = {switchForm} id = "switchForm"/>
        <label htmlFor="switchForm"> Returning User</label>
          <form style ={{display:user.existingUser ? "block": 'none'}} onSubmit = {signInUser}>

          <input type="text" onBlur = {handleChange} name = "email" placeholder = "email" required/>
          <br/>
          <input type="Password" onBlur = {handleChange} name = "password" placeholder = "password" required/>
          <br/>
          <input type="submit" value = "signIn"/>

        </form>
        <form style ={{display:user.existingUser ? 'none': 'block'}} onSubmit={createAccount} >
          <input type="text" onBlur = {handleChange} name = "name" placeholder = "Your Name" required/>
          <br/>
          <input type="text" onBlur = {handleChange} name = "email" placeholder = "email" required/>
          <br/>
          <input type="Password" onBlur = {handleChange} name = "password" placeholder = "password" required/>
          <br/>
          <input type="submit" value = "Create Account"/>
        </form>
        {
          user.error && <p style = {{color:'red'}}>{user.error}</p>
        }
    </div>
  );
}

export default App;
