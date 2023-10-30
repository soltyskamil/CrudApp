import React from 'react'
import { auth } from '../../config/firebase';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/auth/Auth.css'
import image from '../../assets/images/background.jpg'
import google from '../../assets/images/google.png'
function Auth() {
  return (
    <div className='authentication'>
        <div className="auth__background">
            <img src={image} alt="background" />
        </div>
        <div className="auth__login">
            <div className="auth__wrapper">
                <Routes>
                    <Route path='/' exact='true' element={<CreateAccount />}/>
                    <Route path='/login' exact='true' element={<SignIn />}/>
                </Routes>
                <SignInSocials />
            </div>
        </div>
    </div>
  )
}

function CreateAccount(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const createHandler = async e => {
        e.preventDefault()
        if(password.length >= 6){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                Swal.fire({
                    title: 'Success!',
                    text: 'Your account has been successfully created!',
                    icon: 'success',
                    confirmButtonText: 'Close'
                  })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Firebase Authentication Error:", errorCode, errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: errorCode,
                    icon: 'error',
                    confirmButtonText: 'Close'
                  })
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
        <>
        <form onSubmit={createHandler}>
            <div className="wrapper">
            <h2>Sign up</h2>
            <span data-create>Create account with seconds</span>

            </div>
            <label htmlFor="email">
                <input type="email" placeholder='Email Address' name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label htmlFor="password">
                <input type="password" placeholder='Password' name="password" id="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <div className="signup__functions">
                <label htmlFor="checkbox" id='checkboxx'>
                    Keep me logged in
                    <input type="checkbox" name="checkbox" id="checkbox" />
                </label>
                <a href="#">Forgot password?</a>
            </div>
            <button type='submit'>Sign up</button>
        </form>
        <span data-already>Already have an account? <Link to='/login'>Log in</Link></span>
        </>
    )
}


export function SignIn(){
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
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Firebase Authentication Error:", errorCode, errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: errorCode,
                    icon: 'error',
                    confirmButtonText: 'Close'
                  })
            });  
        }
    return (
        // <form onSubmit={signHandler}>
        //     <h2>Sign in</h2>
        //     <input type="email" placeholder='email' name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            // <input type="password" placeholder='password' name="password" id="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
        //     <button type='submit'>Sign in</button>
        // </form>
        <>
        <form onSubmit={signHandler}>
            <div className="wrapper">
            <h2>Login</h2>
            <span data-create>Please enter your login details</span>

            </div>
            <label htmlFor="email">
                <input type="email" placeholder='Email Address' name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label htmlFor="password">
            <input type="password" placeholder='Password' name="password" id="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <div className="signup__functions">
                <label htmlFor="checkbox" id='checkboxx'>
                    Keep me logged in
                    <input type="checkbox" name="checkbox" id="checkbox" />
                </label>
                <a href="#">Forgot password?</a>
            </div>
            <button type='submit'>Log in</button>
        </form>
        <span data-already>Dont have an account? <Link to='/'>Sign up</Link></span>
        </>
    )
}

export function SignInSocials(){
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate()
    const loginWithSocials = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
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
            <div className="google__wrapper">
                    <div className="google__divider"></div>
                        <span>or continue with google</span>
                    <div className="google__divider"></div>
            </div>
            <button onClick={loginWithSocials} data-google>
                <img src={google} alt="google logo" />
            </button>
        </div>
    )
}
export default Auth