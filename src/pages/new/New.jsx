import './new.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { setDoc, doc, serverTimestamp } from "firebase/firestore"; 
import { auth, db, storage } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const New = ({title, inputs}) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [percentage, setPercentage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      const fileName = new Date().getTime() +"_"+ file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setPercentage(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({...prev, img: downloadURL}))
          });
        }
      );
    };
    file && uploadFile();
  }, [file])

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({...data, [id]: value});
  }
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      //create user on firebase and save all the data in firestore
      const addedUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, "users", addedUser.user.uid), {
        ...data, timestamp: serverTimestamp()
      });
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
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
              <button 
                disabled={percentage !== null && percentage < 100} 
                type='submit'
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New