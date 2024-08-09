import '../App.css'
import { Link,Outlet } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import Profile from '../image/profile.jpg'
function Users(){
    const [mydata,setmydata]=useState([])
    let Token = localStorage.getItem('Token');

    axios.interceptors.response.use(resp => resp, async error => { 
        if (error.response.status === 401) {  
            Token=localStorage.getItem('Token')
        }
    })
    useEffect(()=>{
        const fetchData = () => {
            try {
                axios.get('http://127.0.0.1:8000/users/', {
                    headers: {
                        'Authorization': `Bearer ${Token}`,
                    },
                })
                .then(response=>{

                    setmydata(response.data)
                    console.log(response.data)
                })
              
            } 
            catch (error) {
              console.error('Error fetching data', error);
              throw error;
            }
        };
        fetchData()
    },[])

   for (const [key,value] of Object.entries(mydata)){
    console.log(mydata[key])
   }


    return(
        
        <div className="main">
            <div id='col1'>
                <div id="logo">
                    FunChat App
                </div>
                <div id='search-box'>
                    <input type="text" />
                </div>
                <div id="user-menus">
                    <div id="user-list">
                        <div id="title1">
                            <Link>Chat</Link>
                        </div>
                        <div id="list1">
                            {
                                mydata.map((item)=>{
                                    return(
                                        <Link to={{ pathname: `chatroom/${item.id}`, state:{ from: item }    }} id='members' value={item}>
                                            <img src={Profile} alt="pro" width={40} height={40} /><p>{item.username}</p>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id="status">
                        <div id="title2">
                            <Link>Status</Link>
                        </div>
                    </div>
                    <div id="calls">
                        <div id="title3">
                            <Link>Calls</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div id='col2'>
                <Outlet />
            </div>
        </div>
    )
}
export default Users