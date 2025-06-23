import { useState } from 'react';
import InputText from '../inputFields/inputText';
import Dropdown from '../inputFields/dropdown';
import Checkbox from '../inputFields/checkBox';
import FileUpload from '../inputFields/fileUpload';
import SubmitButton from '../button/submitButton';
import { SignupApi } from '../../api/auth/signupApi';
import { toast } from 'react-toastify';
import { ValidateForm } from '../../services/SignupValidation';
import { handleChange } from '../../services/handleChange';
import { Link } from "react-router-dom";

export default function Signup() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        activity: [],
        profileImage: null
    });
    const stateOption = [
        { value: 'mh', label: 'Maharashtra' },
        { value: 'up', label: 'Uttar Pradesh' },
        { value: 'dl', label: 'Delhi' },
        { value: 'ka', label: 'Karnataka' },
        { value: 'tn', label: 'Tamil Nadu' },
        { value: 'tg', label: 'Telangana' },
        { value: 'gj', label: 'Gujarat' },
        { value: 'rj', label: 'Rajasthan' },
        { value: 'ap', label: 'Andhra Pradesh' },
        { value: 'wb', label: 'West Bengal' },
    ];
    const countryOptions = [
        { value: 'pk', label: 'Pakistan' },
        { value: 'in', label: 'India' },
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
    ];
    const activityOptions = [
        { value: 'volvo', label: 'Volvo' },
        { value: 'saab', label: 'Saab' },
        { value: 'fiat', label: 'Fiat' },
        { value: 'audi', label: 'Audi' },
    ];
    const SendForm = new FormData()
    SendForm.append("firstName", formData.firstName)
    SendForm.append("lastName", formData.lastName)
    SendForm.append("gender", formData.gender)
    SendForm.append("email", formData.email)
    SendForm.append("password", formData.password)
    SendForm.append("city", formData.city)
    SendForm.append("state", formData.state)
    SendForm.append("zip", formData.zip)
    SendForm.append("country", formData.country)
    SendForm.append("profileImage", formData.profileImage)
    formData.activity.forEach((act) =>
        SendForm.append("activity", act))

    const handleSubmit = async (e) => {
        e.preventDefault();
          setIsSubmitting(true);
        try {
            const validationErrors = ValidateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                Object.entries(validationErrors).map(([key, value]) => {
                    return toast(value)
                });
                return;
            }
            await SignupApi(SendForm)
        } catch (error) {
            toast.error(error)
        }finally{
            setIsSubmitting(false)
        }




    };


    return (
    <div className="relative no-scrollbar w-full h-screen rounded-lg shadow-md bg-white">
  {/* Full Background Image */}
  <div className="absolute inset-0 z-0">
    <img
      src="/leftImage.jpg" // ✅ Replace this with your own image
      alt="Register Illustration"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right - Form with Scroll */}
  <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 z-10 bg-white bg-opacity-90 overflow-y-auto">
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="max-w-lg w-full p-4 rounded-lg">
        <h2 className="text-2xl my-4 font-semibold text-center">User Registration</h2>
        <form onSubmit={handleSubmit}>

          {/* Name Row */}
          <div className="flex gap-2">
            <InputText type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value, setFormData)} />
            <InputText type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value, setFormData)} />
          </div>

          {/* Gender Radio */}
          <div className="flex gap-4 py-2">
            <InputText type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="male" />
            <label htmlFor="male" className="text-sm">Male</label>

            <InputText type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="female" />
            <label htmlFor="female" className="text-sm">Female</label>

            <InputText type="radio" name="gender" value="other" checked={formData.gender === "other"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="other" />
            <label htmlFor="other" className="text-sm">Other</label>
          </div>

          {/* Email */}
          <InputText type="email" placeholder="Email" name="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value, setFormData)} />

          {/* Password */}
          <div className="flex gap-3">
            <InputText type="password" placeholder="Password" name="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value, setFormData)} />
            <InputText type="password" placeholder="Confirm" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value, setFormData)} />
          </div>

          {/* Address Row 1 */}
          <div className="flex gap-3">
            <InputText type="text" placeholder="City" name="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value, setFormData)} />
            <div className="flex-1">
              <Dropdown options={stateOption} selectedValue={formData.state} onChange={(e) => handleChange("state", e.target.value, setFormData)} label="State" />
            </div>
          </div>

          {/* Address Row 2 */}
          <div className="flex gap-3">
            <InputText type="text" placeholder="Zip" name="zip" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value, setFormData)} />
            <div className="flex-1">
              <Dropdown options={countryOptions} selectedValue={formData.country} onChange={(e) => handleChange("country", e.target.value, setFormData)} label="Country" />
            </div>
          </div>

          {/* Activities */}
          <div className="pt-2">
            <Checkbox fieldName="activity" options={activityOptions} selectedValues={formData.activity} onChange={handleChange} label="Activities" setFormData={setFormData} />
          </div>

          {/* File Upload */}
          <FileUpload name="profileImage" onChange={handleChange} preview={false} setFormData={setFormData} />

          {/* Submit */}
          <SubmitButton type="submit" className="w-full mt-4">
            {isSubmitting ? "Saving..." : "Submit"}
          </SubmitButton>
        </form>

        <p className="mt-4 text-sm text-center">
          Already registered? <Link to="/login" className="text-blue-600 underline">Login Here</Link>
        </p>
      </div>
    </div>
  </div>
</div>
    );
}