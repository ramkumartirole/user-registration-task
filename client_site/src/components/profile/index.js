import React, { useEffect, useState } from 'react'
import { setEditUser } from '../../redux/slice/Edit';
import { useDispatch, useSelector } from 'react-redux';
import SubmitButton from '../button/submitButton';
import { DeleteUser } from '../../api/users/deleteUser';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profile, setProfile] = useState()
    const data = useSelector((state) => state.userData.userData)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setProfile(user)
    }, [])

    const filterUser = data?.filter((user)=>user?.email === profile?.email)

    return (
<div className='bg-white rounded-xl shadow-lg '>
     <header className='p-6'>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">User Profile</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mb-4"></div>
      </header>
          <div className="min-h-screen w-full flex justify-center items-center p-4" >

      {filterUser?.map((profile) => (
        <div
          key={profile._id}
          className="max-w-md bg-white shadow-xl rounded-2xl p-6 animate-fadeIn"
        >
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={profile?.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-400 shadow-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=User';
              }}
            />
            <h2 className="text-2xl font-bold mt-4 text-gray-800 capitalize">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Gender:</span>
              <span className="capitalize">{profile?.gender}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">City:</span>
              <span>{profile?.city.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">State:</span>
              <span>{profile?.state.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Country:</span>
              <span className="uppercase">{profile?.country}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Zip Code:</span>
              <span>{profile?.zip}</span>
            </div>
          </div>

          {/* Activities */}
          <div className="mt-6">
            <h3 className="text-gray-700 font-semibold mb-2">Activities:</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.activity?.map((act, i) => (
                <span
                  key={i}
                  className="bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full"
                >
                  {act}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <SubmitButton className='bg-green-500'
                onClick={() => {
                  dispatch(setEditUser(profile));
                  navigate("/signup");
                }}
              >
                Edit
              </SubmitButton>

              <SubmitButton className='bg-red-500'
                onClick={() => {
                  DeleteUser(profile._id);
                }}
              >
                Delete
              </SubmitButton>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};
