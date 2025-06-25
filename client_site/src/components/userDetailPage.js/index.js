import { useSelector } from 'react-redux';
import { DeleteUser } from '../../api/users/deleteUser';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEditUser } from '../../redux/slice/Edit';
export default function UserDetailPage({id, setShowDetail}) {
    const navigate = useNavigate()
    const distpatch = useDispatch()
  const data = useSelector((state)=>state.userData.userData)

  const filterUser = data.filter((i)=>i._id.toString() === id.toString())

  return (
<div className=''>
  <div className="">
    <div className="">
      {filterUser?.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-xl shadow-2xl p-6 relative animate-fadeIn flex flex-col"
        >

          <button
            onClick={() => setShowDetail(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl transition-colors duration-200"
            aria-label="Close details"
          >
            &times;
          </button>


          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-400"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100?text=User';
                }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>


          <div className="mt-4 space-y-2 text-sm text-gray-600 flex-grow">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium">Gender:</span>
              <span className="capitalize text-gray-700">{user.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium">Country:</span>
              <span className="uppercase text-gray-700">{user.country}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium">Zip Code:</span>
              <span className="text-gray-700">{user.zip}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-gray-700 font-semibold mb-2">Activities:</h3>
            <div className="flex flex-wrap gap-2">
              {user.activity.map((act, i) => (
                <span
                  key={i}
                  className="bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
          <div className='flex justify-between my-6'>
            <div>
 <button
                    onClick={() => {
                      distpatch(setEditUser(user));
                      navigate('/signup');
                    }}
                    className="text-cyan-600 hover:underline text-sm font-semibold"
                  >
                    Edit
                  </button>
            </div>
            <div>
                <button
                                    onClick={() => {DeleteUser(user._id, distpatch)
                                         setShowDetail(false)}}
                                    className="text-red-500 hover:underline text-sm font-semibold"
                                  >
                                    Delete
                                  </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};
