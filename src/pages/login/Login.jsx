import { useState } from 'react'
import './login.scss'
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from '../../firebase';

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setError(false);
    } catch (error) {
      setError(true);
    }
  } 

  return (
    <div className='login'>
      <form onSubmit={handleLogin}>
        <input type='text' placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
        <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit'>Login</button>
        {error && <span>Wrong Email or Password</span> }
      </form>
    </div>
  )
}

export default Login