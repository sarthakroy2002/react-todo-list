import {useContext, useEffect, useState} from "react";
import UserContext from "./UserContext";
import axios from "axios";

function Home() {
  const userInfo = useContext(UserContext);
  const [inputVal, setInputVal] = useState('');
  const [todos,setTodos] = useState([]);

  useEffect(() => {
    axios.get('/todos', {withCredentials:true})
      .then(response => {
        setTodos(response.data);
      })
  }, []);

  if (!userInfo.email) {
    return 'Your need to be logged in to see this page';
  }

  function addTodo(e) {
    e.preventDefault();
    axios.put('/todos', {text:inputVal}, {withCredentials:true})
      .then(response => {
        setTodos([...todos, response.data]);
        setInputVal('');
      })

  }

  return <div>
    <form onSubmit={e => addTodo(e)}>
      <input id='maintxtbox'
             placeholder={'Enter your Note here...'}
             value={inputVal}
             onChange={e => setInputVal(e.target.value)}/>
      <button className='noter addnoter' onSubmit={e => addTodo(e)}><span>Add Note</span></button>
    </form>
    <ul>
      {todos.map(todo => (
        <li>
          {todo.done ? <del>{todo.text}</del> : todo.text}
        </li>
      ))}

    </ul>
  </div>
}

export default Home;