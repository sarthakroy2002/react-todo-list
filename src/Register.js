import {useState, useContext} from 'react';
import axios from 'axios';
import UserContext from "./UserContext";

function Register() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [Navigate,setNavigate] = useState(false);

  const user = useContext(UserContext);

  function registerUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('/register', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setNavigate(true);
      });
  }

  if (Navigate) {
    return <Navigate to={'/'} />
  }

  return (
    <form action="" onSubmit={e => registerUser(e)} className='boxer'>
      Email: <input className='txter' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/><br />
      Password: <input className='txter' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/><br />
      <button className='noter recc' type="submit">Register</button>
    </form>
  );
}

export default Register;