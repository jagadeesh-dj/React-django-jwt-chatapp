import '../App.css'
import { json, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Signup(){
    const navigate=useNavigate()

    const [input,setinput]=useState({
        username:'',
        email:'',
        password:''
    })

    const inputhandle=(event)=>{
        const {name,value}=event.target
        setinput((item)=>({...item,[name]:value}))
    }
    const Eventhandle=(e)=>{
        e.preventDefault()
        const data=JSON.stringify({username:input.username,email:input.email,password:input.password})
        axios.post('http://127.0.0.1:8000/signup/',data,{
                headers:{
                    'Content-Type':'application/json',
                }
            }
        )
        .then(response=>{
            if (response.data.status===201){
                navigate('/')
            }
        })
        .catch(error=>{
            console.log(error)
        })
        setinput({
            username:'',
            email:'',
            password:''
        })
        
    }
    return (
        <div className="signup-page">
            <div id='signup'>
                <div id="notify">

                </div>
                <div id="forms">
                    <div>
                        <h2>Register FunChat</h2>
                    </div>
                    <form onSubmit={Eventhandle} autoComplete='off'>
                        <div>
                            <input type="text" name="username" id="username" value={input.username} onChange={inputhandle} placeholder="Username" />
                            <small id="error1"></small>
                        </div>
                        <div>
                            <input type="text" name="email" id="email" value={input.email} onChange={inputhandle} placeholder="Email Address" />
                            <small id="error2"></small>
                        </div>
                        <div>
                            <input type="password" name="password" value={input.password} onChange={inputhandle} id="password" placeholder="Password" />
                            <small id="error3"></small>
                        </div>
                        {/* <div>
                            <input type="password" name="confpass"  id="confpass" placeholder="Confirm Password" />
                            <small id="error4"></small>
                        </div> */}
                        <div>
                            <button >Signup</button>
                        </div>
                        <div>
                            <p>I already have an account: <Link to="/">Signin</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Signup;