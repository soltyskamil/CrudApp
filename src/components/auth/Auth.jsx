import React from 'react'
import { initializeApp } from "firebase/app";
import { firebaseConfig, auth} from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/auth/Auth.css'
import image from '../../images/signbackground.jpg'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
function Auth() {
  return (
    <div className='authentication'>
        <div className="auth__background">
            <img src={image} alt="background" />
        </div>
        <div className="auth__login">
            <LockOutlinedIcon/>
            <CreateAccount />
            <SignIn />
            <SignInSocials />
        </div>
    </div>
  )
}

function CreateAccount(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState({password: '', passwordConfirmed: ''})
    const createHandler = async e => {
        e.preventDefault()
        if(password.password === password.passwordConfirmed && password.password.length >= 6 && password.passwordConfirmed.length >= 6){
            createUserWithEmailAndPassword(auth, email, password.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                Swal.fire({
                    title: 'Success!',
                    text: 'Your account has been successfully created!',
                    icon: 'success',
                    confirmButtonText: 'Close'
                  })
                  navigate('/dashboard')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Firebase Authentication Error:", errorCode, errorMessage);
            });  
        }else{
          Swal.fire({
            title: 'Error!',
            text: 'Your password are too short, or doesnt match.',
            icon: 'error',
            confirmButtonText: 'Close'
          })
        }
      }
    return (
        <form onSubmit={createHandler}>
            <h2>Make an account</h2>
            <input type="email" placeholder='email' name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='password' name="password" id="password" value={password.password}  onChange={(e) => setPassword({password: e.target.value, passwordConfirmed: password.passwordConfirmed})}/>
            <input type="password" placeholder='confirm password' name="confirmed_password" id="confirmed_password" value={password.passwordConfirmed} onChange={(e) => setPassword({password: password.password, passwordConfirmed: e.target.value})}/>
            <button type='submit'>Register</button>
        </form>
    )
}


function SignIn(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const signHandler = async e => {
        e.preventDefault()
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                Swal.fire({
                    title: 'Success!',
                    text: 'Logged in successfully',
                    icon: 'success',
                    confirmButtonText: 'Close'
                  })
                navigate('/dashboard')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Firebase Authentication Error:", errorCode, errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: 'Incorrect credentials.',
                    icon: 'error',
                    confirmButtonText: 'Close'
                  })
            });  
        }
    return (
        <form onSubmit={signHandler}>
            <h2>Sign in</h2>
            <input type="email" placeholder='email' name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='password' name="password" id="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>Sign in</button>
        </form>
    )
}

function SignInSocials(){
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate()
    const loginWithSocials = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            navigate('/dashboard')
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            Swal.fire({
                title: 'Error!',
                text: 'Incorrect credentials.',
                icon: 'error',
                confirmButtonText: 'Close'
            })
        })}

    return (
        <div className='google'>
            <h2>Or just login with google</h2>
            <button onClick={loginWithSocials}>
                Login with google
            </button>
        </div>
    )
}
export default Auth