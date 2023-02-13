import './new.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { setDoc, doc } from "firebase/firestore"; 
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const New = ({title, inputs}) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({...data, [id]: value});
  }
  const handleAdd = async (e) => {
    e.preventDefault();
    const addedUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await setDoc(doc(db, "users", addedUser.user.uid), data);
  }

  return (
    <div className='new'>
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : "https://picsum.photos/600/800" } alt="img" />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor='file'>
                  Image: <DriveFolderUploadOutlined className='icon'/>
                </label>
                <input type='file' id='file' hidden onChange={(e) => setFile(e.target.files[0])}/>
              </div>
              {inputs.map((input) => {
                return (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput}/>
                  </div>
                );
              })}
              <button type='submit'>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New