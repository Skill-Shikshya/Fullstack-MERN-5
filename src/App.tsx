import React, { use, useEffect, useState } from 'react';
import {io} from "socket.io-client";

type Props = {}
const socket = io("http://13.237.94.113:5000");

const App:React.FC<any> = (props: Props) => {

  const [room,setRoom] = useState("");
  const [username,setUsername] = useState("");
  const [message,setMessage] = useState("");
  const [joined,setJoined] = useState(false);
  const [chat,setChat] = useState<any>([]);
const [typingUser, setTypingUser] = useState<string | null>(null);


  const handleJoin = () => {
    if(room && !joined && username) {
      socket.emit("join",room);  //room : test123 //sockeid : Vdf2ijX0THqI2w-VAAAP
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if(message){
      const msgData = {
        room,
        message,
        username,
        date : new Date()
      };
      socket.emit("send_message" ,msgData);
      // setChat((prev:any) => ([...prev , msgData]));
      setMessage("");
    };
  };


  useEffect(()=> {
      const handler = (data:any)  => {
        console.log("🚀 ~ handler ~ data:", data)
      setChat((prev:any) => ([...prev , data]));
      };
      socket.on('recived_message' , handler);

      return () => socket.off('recived_message');
  }, []);

  
    
useEffect(() => {
  const typingHandler = (data: any) => {
    if (data.username !== username) {
      setTypingUser(data.username);
      // Remove "typing" after 3 seconds
      setTimeout(() => setTypingUser(null), 3000);
    }
  };

  socket.on("user_typing", typingHandler);

  return () => {
    socket.off("user_typing", typingHandler);
  };
}, [username]);


  const handleLeave = () => {
    setMessage("");
    setChat([]);
    setJoined(false);
    setRoom("");
  };
const handleTyping = () => {
  if (joined && username && room) {
    socket.emit("typing", { username, room });
  }
};




  return (<>

      {!joined && <div className="">
        <input type="text" placeholder='Room Id' value={room} onChange={(e)=> setRoom(e.target.value)} />
        <input type="text" placeholder='Username' value={username} onChange={(e)=> setUsername(e.target.value)} />
        <button onClick={handleJoin}>Join</button>
      </div>}


{joined && <div className="">
  <textarea placeholder='message ... ' value={message}  onChange={(e)=> {setMessage(e.target.value); handleTyping()}}></textarea>
        <button onClick={sendMessage}>Send</button>
</div>}
{
 typingUser && <p>Someone is typing...</p>
}


{
  joined && 
  <div className="messageBox">
    <div className="" style={{display:"flex", gap:30}}>
      <p>Chat History in {room}:</p>
      <button onClick={()=>{handleLeave()}}>Leave</button>
    </div>
    {
      chat?.length <= 0 && <p>No chats yet!</p>
    }
    {
      chat?.map((item:any) => <div> <span style={{color : getColorFromUsername(username)}}>{item.username}</span> : {item.message} </div>)
    }
</div>
}
  
  
  
  </>)
}

export default App;




function getColorFromUsername(username:string) {
  // Simple hash function to turn username into a number
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to a hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
}
