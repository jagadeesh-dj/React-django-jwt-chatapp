import {Link} from 'react-router-dom'
import '../App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Signin(){
    const navigate=useNavigate()
    const [isLoad,setisLoad]=useState(false)
    // axios.interceptors.

    const [loginform,setform]=useState({
        username:'',
        password:''
    })

    useEffect(()=>{
        const Token=localStorage.getItem('Token')
        if(Token){
            navigate('/funchat')
        }
    })
    

    const formhandle=(e)=>{
        const {name,value}=e.target
        setform(item=>({...item,[name]:value}))
    }

    const Inputhandling=async(e)=>{
        e.preventDefault();
        setisLoad(true)

        await axios.post('http://127.0.0.1:8000/token/',loginform,{
            headers:{
                'Content-Type':'application/json'
            }
            
        },{withCredentials: true})
        .then(response=>{
            console.log(response.data['refresh'])
            if(response.status===200){
                navigate('/funchat')
                localStorage.setItem("Token",response.data.access)
                localStorage.setItem("Refresh",response.data.refresh)
                axios.defaults.headers.common['Authorization']=`Bearer ${response.data['access']}`


            }
        })
        .catch(error=>{
            console.log(error)
        })
        setisLoad(false)
    }

    return (
        <>
        {
            isLoad ? (

                <div id='loading'>
                    <div id='loader'></div>
                </div>
            ) : 
            (
                    <div className="signup-page">
                        <div id='signup'>
                            <div id="notify">
        
                            </div>
                            <div id="forms" autoComplete="off" onSubmit={Inputhandling}>
                                <div>
                                    <h2>Welcome Back</h2>
                                </div>
                                <form action="" autoComplete='off'>
                                    <div>
                                        <input type="text" name="username" value={loginform.username} onChange={formhandle} id="username" placeholder="Username" />
                                        <small id="error1"></small>
                                    </div>
                                    <div>
                                        <input type="password" name="password" value={loginform.password} onChange={formhandle} id="password" placeholder="Password" />
                                        <small id="error3"></small>
                                    </div>
                                
                                    <div>
                                        <button>Signup</button>
                                    </div>
                                    <div>
                                        <p>I don't have an account: <Link to="/signup">Signup</Link></p>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                )
                
            }
        </>

    )
}
export default Signin;