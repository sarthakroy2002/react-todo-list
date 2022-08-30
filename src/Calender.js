import { useState, useContext } from 'react';
import UserContext from "./UserContext";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";
import './Calender.css'

function Calender() {
  const userInfo = useContext(UserContext);
  const [date, setDate] = useState(new Date());

if (!userInfo.email) {
   return 'Your need to be logged in to see this page';
}

  return <div>
      <h1 className='text-center'>Calendar</h1>
      <div className='calendar-container ong'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <div>
        <Link to={'/'}><button className='noter tmpr oppx'><span>Go to To-Do-List</span></button></Link>
      </div>  
  </div>
}

export default Calender;