import {useState, useContext} from 'react';
import axios from 'axios';
import UserContext from "./UserContext";
import { Link } from "react-router-dom";

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loginError,setLoginError] = useState(false);
  const [Navigate,setNavigate] = useState(false);

  const user = useContext(UserContext);

  function loginUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('/login', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setLoginError(false);
        setNavigate(true);
      })
      .catch(() => {
        setLoginError(true);
      });
  }

  if (Navigate) {
    return <>
    <Link to={'/'}><button className='noter tmpr'><span>Go to To-Do-List</span></button></Link>
    </>
  }

  return (
    <form action="" onSubmit={e => loginUser(e)} className='boxer'>
      {loginError && (
        <div>Invalid Credentials!</div>
      )}
      Email: <input className='txter' type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/><br />
      Password:<input className='txter' type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/><br />
      <button className='noter recc' type="submit">Login</button>
    </form>
  );
}

export default Login;