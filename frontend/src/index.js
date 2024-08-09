import ReactDOM from 'react-dom/client';
import './index.css';
import Users from './Components/Users';
import Chatbox from './Components/Chatbox';
import reportWebVitals from './reportWebVitals';
import Signup from './Components/Signup';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Signin from './Components/Signin';
import Protected from './Components/Protected';
import './Components/Interceptors'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='signup' element={<Signup />} />
        <Route element={<Protected />} >
          <Route path='funchat' element={<Users />} >
            <Route path='chatroom/:id' element={<Chatbox />}  />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
