import axios from "axios"
import { useState,useEffect,useRef } from "react"
import { json, useParams } from "react-router-dom"
import Image from '../image/profile.jpg'

function Chatbox(){
    let Token=localStorage.getItem('Token')
    const ws=useRef(null)
    const { id }=useParams()
    const [messages,setmessage]=useState()
    const [FetchedMessage,setFetchedMessage]=useState([])
    const chatEndRef = useRef(null);


    axios.interceptors.response.use(resp => resp, async error => { 
        if (error.response.status === 401) {  
            Token=localStorage.getItem('Token')
        }
    })
    useEffect(() => {
        // Scroll to the bottom whenever messages change
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [FetchedMessage]);

    useEffect(()=>{

        axios.get(`http://127.0.0.1:8000/message/${id}/`,{
            headers:{
                'Authorization':`Bearer ${Token}`
            }
        })
        .then(response=>{
            setFetchedMessage(response.data)
            console.log(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
        
    },[id])

    useEffect(()=>{

        if(ws.current){
            ws.current.close()
        }
        ws.current=new WebSocket(`ws://127.0.0.1:8000/ws/chatroom/${id}/?token=${Token}`)

        ws.current.onopen=()=>{
            // alert("websocket connected")


        }
        ws.current.onmessage=(e)=>{
            setFetchedMessage((prevMessages) => [...prevMessages, JSON.parse(e.data)]);


        }
        
    },[id])    

    const SendMessage=(e)=>{
        e.preventDefault()
        ws.current.send(JSON.stringify({
            type:'message',
            message:messages,
            receiver:id
        }));
        setmessage('')
    }
    console.log(messages)
    
    return(
        <div className="chatbox">
            <div id="profile-area">
                <div id="profile">
                    <img src={Image} alt="img" />
                </div>
                
            </div>
            <div id="chat-area">  
                <table>
                    <tbody>
                        {
                           FetchedMessage.map(item=>{
                                if(item.receiver!=id){
                                    return (
                                        <tr id="rec" >
                                            <img src={Image} alt="pro" width={20} height={20} /><p id="receiver">{item.message}</p>
                                        </tr>
                                    )
                                }
                                else{
                                    return(
                                        <tr id="sec">
                                            <p id="sender">{item.message}</p><img src={Image} alt="pro" width={20} height={20} />
                                        </tr>
                                    )
                                }
                           })
                        }
                    </tbody>
                </table>
                <div ref={chatEndRef} />
            </div>
            <div id="send-box" onSubmit={SendMessage}>
                <form action="">

                    <div>
                        <input type="text" value={messages} onChange={(e)=>setmessage(e.target.value)} placeholder="Enter Your Message" />
                    </div>
                    <div>
                        <i class="fa-solid fa-paper-plane fa-lg"  id="submitbtn"></i>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Chatbox;