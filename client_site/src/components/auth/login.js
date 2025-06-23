import { useState } from "react"
import InputText from "../inputFields/inputText"
import { handleChange } from "../../services/handleChange"
import SubmitButton from "../button/submitButton"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { LoginApi } from "../../api/auth/login"
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from "./forgotPasswordModal"


export default function Login() {
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
  {/* Full Background Image */}
  <div className="absolute inset-0 z-0">
    <img
      src="/leftImage.jpg" // Replace with your image
      alt="Background"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Form Container */}
  <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-2/4 z-10 bg-white bg-opacity-90 overflow-y-auto">
    <div className="max-w-md mx-auto p-4 rounded-lg">
      <h2 className='text-2xl my-4 font-semibold'>Login</h2>
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
      <p className="mt-4 text-center">
       Dont have an account <Link to="/" className="text-blue-600 underline"> Registration</Link>
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

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}

  </div>
</div>
    )
}
