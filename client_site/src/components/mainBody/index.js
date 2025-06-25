import React,{useState,useEffect} from 'react'
import { DeleteUser } from '../../api/users/deleteUser';
import { setEditUser } from '../../redux/slice/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../api/users/getAllUsers';
import { setUserData } from '../../redux/slice/UserData';
import UserDetailPage from '../userDetailPage.js';
import ChangePasswordModal from '../auth/changePasswordModal.js';
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
export default function MainBody() {
    const navigate = useNavigate()
      const dispatch = useDispatch()
      const [id,setId]=useState()
      const [showDetail,setShowDetail]=useState(false)
      const [showPassModal,setShowPassModal]=useState(false)
      const [loggedUser, setLoggedUser] =useState()
      const data = useSelector((state)=>state.userData.userData)
      useEffect(()=>{
         const user = JSON.parse(localStorage.getItem("user"));
        setLoggedUser(user)

        const fetch = async()=>{
          const res = await getUsers()

      dispatch(setUserData(res?.allUser))
        }
        fetch()
      },[])
  return (
    <div>
        <main className="h-screen  overflow-auto">
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <header>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">User Data</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mb-4"></div>
      </header>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-3 px-4">Photo</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Activities</th>
              <th className="py-3 px-4">Gender</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.filter(user => user?.email !== loggedUser?.email)?.map((user) => (
              <tr  key={user?._id} className="hover:bg-gray-50 transition border-b">
                <td className="py-3 px-4">
                  <img
                    src={user?.profileImage}
                    alt="Profile"
                    className="rounded-full h-10 w-10 object-cover ring-2 ring-cyan-400"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                </td>
                <td onClick={()=>{setShowDetail(true);
              setId(user?._id)}} className="py-3 px-4 font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </td>
                <td onClick={()=>{setShowDetail(true);
              setId(user?._id)}} className="py-3 px-4 text-gray-600">{user?.email}</td>
                <td onClick={()=>{setShowDetail(true);
              setId(user?._id)}} className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {user?.activity?.map((activity, i) => (
                      <span
                        key={i}
                        className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 capitalize text-gray-600">{user.gender}</td>
               <td className="py-3 px-4">
  <div className="flex items-center gap-3 flex-wrap">
    <button
      onClick={() => {
        dispatch(setEditUser(user));
        navigate('/signup');
      }}
      className="text-cyan-600 hover:underline text-sm font-semibold flex items-center gap-1"
    >
      <MdModeEditOutline /> Edit
    </button>

    <button
      onClick={() => DeleteUser(user._id, dispatch)}
      className="text-red-500 hover:underline text-sm font-semibold flex items-center gap-1"
    >
      <MdDelete /> Delete
    </button>

    <button
      className="text-green-500 hover:underline text-sm font-semibold flex items-center gap-1"
      onClick={() => {
        setShowPassModal(true);
        setId(user?._id);
      }}
    >
      Change Password
    </button>
  </div>
</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </main>
  {showPassModal ? <ChangePasswordModal id={id} setShowPassModal={setShowPassModal}/> :""}
  {showDetail && (
  <div className="absolute inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-3xl">
      <UserDetailPage id={id} setShowDetail={setShowDetail} />
    </div>
  </div>
)}
    </div>
  )
}
