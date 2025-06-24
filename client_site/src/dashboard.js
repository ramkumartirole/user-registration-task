import { useState,useEffect } from "react";
import { getUsers } from "./api/users/getAllUsers";
import SubmitButton from "./components/button/submitButton";
import { IoHomeOutline } from "react-icons/io5";
import { BsPersonFill } from "react-icons/bs";
import { useDispatch,useSelector } from 'react-redux';
import { setEditUser } from "./redux/slice/Edit";
import { DeleteUser } from "./api/users/deleteUser";
import {setUserData} from "./redux/slice/UserData"
import { useNavigate } from "react-router-dom";




export default function Dashboard() {
  const data = useSelector((state)=>state.userData.userData)
  const navigate = useNavigate()
  const [token,setToken]=useState(null)
  const distpatch = useDispatch()

useEffect(()=>{
  const token = localStorage.getItem("token")
  setToken(token)
  const fetch = async()=>{
    const res = await getUsers()

distpatch(setUserData(res.allUser))
  }
  fetch()
},[])

  return (
    <div className="flex h-screen gap-8">
      <div className="w-1/6 bg-white shadow rounded-lg flex flex-col">
  <nav className="flex-1 flex flex-col">
    <ul className="flex-1">
      <div className="p-4 border-b border-gray-200">
        <li className="text-2xl font-bold text-blue-500">Dashboard</li>
      </div>
      <div className="p-4 space-y-3">
        <li className="p-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors cursor-pointer">
          <IoHomeOutline className="inline mr-2 mb-1" />
          Home
        </li>
        <li className="p-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors cursor-pointer">
          <BsPersonFill className="inline mr-2 mb-1" />
          Profile
        </li>
      </div>
    </ul>

    <div className="p-4 border-t border-gray-200">
      {token ? (
        <SubmitButton
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Logout
        </SubmitButton>
      ) : (
        <SubmitButton
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Login
        </SubmitButton>
      )}
    </div>
  </nav>
</div>
    <div className="flex flex-col h-screen bg-gray-50 p-4">
  <div className="bg-white shadow rounded-lg flex flex-col h-full overflow-hidden">
    <div className="p-4">
      <h2 className="text-gray-500 text-lg font-semibold pb-4">User Data</h2>
      <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
    </div>

    <div className="flex-1 overflow-auto px-4 pb-4">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="text-sm leading-normal">
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Photo</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Name</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Email</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Activities</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Gender</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user) => (
            <tr key={user._id} className="hover:bg-grey-lighter">
              <td className="py-2 px-4 border-b border-grey-light">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="rounded-full h-10 w-10 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
              </td>
              <td className="py-2 px-4 border-b border-grey-light">
                {user.firstName} {user.lastName}
              </td>
              <td className="py-2 px-4 border-b border-grey-light">{user.email}</td>
              <td className="py-2 px-4 border-b border-grey-light">
                <div className="flex flex-wrap gap-1">
                  {user.activity.map((activity, index) => (
                    <span
                      key={index}
                      className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-2 px-4 border-b border-grey-light capitalize">{user.gender}</td>
              <td className="py-2 px-4 border-b border-grey-light capitalize">
                <button onClick={()=>{distpatch((setEditUser(user)));
                  navigate("/signup")} } className="text-cyan-600 hover:text-cyan-800 mr-2">Edit</button>
                <button onClick={()=>DeleteUser(user._id, distpatch)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </div>

  );
};
