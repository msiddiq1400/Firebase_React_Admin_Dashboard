import { Link } from 'react-router-dom';
import { userColumns } from '../../datatablesource';
import './datatable.scss';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { 
  collection, 
  // eslint-disable-next-line no-unused-vars
  getDocs, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from '../../firebase';


const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // // REFRESH PAGE AND UPDATE STATE
    // const fetchData = async () => {
    //   let list = [];
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({id: doc.id, ...doc.data()});
    //     });
    //     setData(list)
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchData();

    //REAL TIME UPDATE
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach(doc => {
        list.push({id: doc.id, ...doc.data()})
        setData(list)
      }, (error) => {
        console.log(error)
      });
    });
    return () => {
      unsub();
    }
  }, [])

  const handleDelete = async (rowId) => {
    try {
      await deleteDoc(doc(db, "users", rowId));
      setData(data.filter(item => item.id !== rowId))
    } catch (err) {
      console.log(err)
    }
  }

  const actionColums = [
    {field: "action", headerName: "Action", width: 200, renderCell: (params) => {
        return (
            <div className='cellAction'>
                <Link to="/users/45" style={{textDecoration: "none"}}>
                    <div className='viewButton'>View</div>
                </Link>
                <div className='deleteButton' onClick={() => handleDelete(params.row.id)}>Delete</div>
            </div>
        );
    }}
  ];
  return (
    <div className='datatable'>
        <div className="datatableTitle">Add New User
        <Link to="/users/new" className='link' style={{textDecoration: "none"}}>
            Add New
        </Link>
        </div>
        <DataGrid
            className='datagrid'
            rows={data}
            columns={userColumns.concat(actionColums)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
        />
    </div>
  )
}

export default DataTable 