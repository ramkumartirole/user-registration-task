import { useState } from "react"
import InputText from "../inputFields/inputText"
import { handleChange } from "../../services/handleChange"
import SubmitButton from "../button/submitButton"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { LoginApi } from "../../api/auth/login"
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from "./forgotPasswordModal"
import { clearEditUser } from "../../redux/slice/Edit"
import { useDispatch } from 'react-redux';


export default function Login() {
  const distpatch =useDispatch()
    const [isSubmitting, setIsSubmitting] = useState(false);
      const [showForgotPassword, setShowForgotPassword] = useState(false);

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email === "" || formData.password === "") {
            toast.error("fill all field")
        }
        setIsSubmitting(true);
        try {

            await LoginApi({
                email: formData.email,
                password: formData.password
            },navigate)
        } catch (error) {
            toast.error(error)
        } finally {
            setIsSubmitting(false)
        }
    };
    return (
        <div className="relative min-h-screen w-full">
   <div className="absolute inset-0 z-0 bg-blue-500 ">
    <div className=' flex  ml-20 items-center h-screen text-gray-100'>

      <div className='w-2/6'>
<h2 className='text-3xl font-mono font-bold '>Welcome Again</h2>
         Log in to access your personalized dashboard, saved preferences, and exclusive member benefits.

        </div>
    </div>

  </div>

  <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-2/4 z-10 bg-white bg-opacity-90 overflow-y-auto">
    <div className="max-w-md mx-auto p-4 rounded-lg">
      <h2 className='text-4xl mb-8 font-semibold text-center'>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <InputText
          type="text"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange("email", e.target.value, setFormData)}
          value={formData.email}
        />

        {/* Password Field */}
        <InputText
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value, setFormData)}
        />

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          className="w-full mt-4"
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </SubmitButton>
      </form>

      {/* Login Link */}
      <p onClick={()=>{distpatch(clearEditUser())}} className="mt-4 text-center">
       Dont have an account <Link to="/signup" className="text-blue-600 underline"> Registration</Link>
      </p>
    </div>
 <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

{/* Social Login */}
<div className="mt-8">
  <div className="flex items-center justify-center mb-4">
    <span className="text-gray-400 text-sm">or login with</span>
  </div>

  <div className="flex justify-center gap-4">
    {/* Google */}
    <button
      className="bg-white border border-gray-200 shadow-md p-3 rounded-full hover:shadow-lg transition"
      title="Login with Google"
    >
      <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-6 h-6" />
    </button>

    {/* Twitter */}
    <button
      className="bg-white border border-gray-200 shadow-md p-3 rounded-full hover:shadow-lg transition"
      title="Login with Twitter"
    >
      <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" className="w-6 h-6" />
    </button>

    {/* GitHub */}
    <button
      className="bg-white border border-gray-200 shadow-md p-3 rounded-full hover:shadow-lg transition"
      title="Login with GitHub"
    >
      <img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" alt="GitHub" className="w-6 h-6" />
    </button>
  </div>
</div>

        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}

  </div>
</div>
    )
}
