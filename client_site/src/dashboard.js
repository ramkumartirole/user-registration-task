import { useState, useEffect } from "react";
import SubmitButton from "./components/button/submitButton";
import { IoHomeOutline } from "react-icons/io5";
import { GoSignIn } from "react-icons/go";
import { BsPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Logout } from "./services/logout";
import MainBody from "./components/mainBody/index.js";
import Profile from "./components/profile/index.js";
import Signup from "./components/auth/signup.js"
import { clearEditUser } from "./redux/slice/Edit.js";
import { useDispatch } from "react-redux";
export default function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [token, setToken] = useState(null)
  const [value, setValue] = useState("Home")
  const [signVal, setSignVal] = useState(false)



  useEffect(() => {
    const token = localStorage.getItem("token")
    setToken(token)

  }, [])

  return (
    <>

      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 p-10 bg-white shadow-lg rounded-r-2xl flex flex-col justify-between">
          <nav>
            <h2 className="text-2xl font-extrabold text-blue-600 mb-6 border-b py-4">Dashboard</h2>
            <ul className="space-y-3">
              <li onClick={() => setValue("Home")} className="flex items-center p-2 font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition">
                <IoHomeOutline className="mr-2" />
                Home
              </li>
              <li onClick={() => setValue("Profile")} className="flex items-center p-2 font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition">
                <BsPersonFill className="mr-2" />
                Profile
              </li>
              <li onClick={() => {
                setValue("Signup")
                setSignVal(true)
                dispatch(clearEditUser())

              }} className="flex items-center p-2 font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition">
                <GoSignIn className="mr-2" />
                Register User
              </li>
            </ul>
          </nav>
          <div className="pt-4 border-t">
            {token ? (
              <SubmitButton
                onClick={() => Logout(navigate)}
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Logout
              </SubmitButton>
            ) : (
              <SubmitButton
                onClick={() => navigate('/')}
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Login
              </SubmitButton>
            )}
          </div>
        </aside>

        {/* Main Content Area with internal scroll */}
        <main className="flex-1 h-full overflow-y-auto p-6">
          {value === "Profile" ? <Profile /> : value === "Home" ? <MainBody /> : value === "Signup" ? <Signup signVal={signVal} setValue={setValue} /> : <MainBody />}
        </main>
      </div>

    </>
  );
};
