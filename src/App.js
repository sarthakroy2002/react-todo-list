import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {useState,useEffect} from 'react';
import Register from "./Register";
import UserContext from "./UserContext";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import Calender from "./Calender";

function App() {
  const [email,setEmail] = useState('');

  useEffect(() => {
    axios.get('/user', {withCredentials:true})
      .then(response => {
        setEmail(response.data.email);
      });
  }, []);

  function logout() {
    axios.post('/logout', {}, {withCredentials:true})
      .then(() => setEmail(''));
  }

  return (
    <>
    <UserContext.Provider value={{email,setEmail}}>
      <BrowserRouter>
        <nav>
          <h1 id='head'><Link to={'/'}>To-Do-List</Link></h1>
          <Link to={'/'}><logoi>Home</logoi></Link>
          {!email && (
            <>
              <Link to={'/login'}><logoi>Login</logoi></Link>
              <Link to={'/register'}><button className='registerr'>Register</button></Link>
            </>
          )}
          {!!email && (
            <>
              <Link to={'/cal'}><logoi>Calendar</logoi></Link>
              <button className='noter okh' onClick={e => {e.preventDefault();logout();}}>Logout</button>
            </>
          )}
        </nav>
        <main>
          <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/register'} element={<Register />} />
            <Route exact path={'/login'} element={<Login />} />
            <Route exact path={'/cal'} element={<Calender />} />
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
    </>
  );
}

export default App;
