import { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EditUser } from '../../api/users/editUser';



export default function Signup() {
  const editData = useSelector((state) => state.editUser.editUser)
  const navigate = useNavigate()
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
  { value: 'reading', label: 'Reading' },
  { value: 'traveling', label: 'Traveling' },
  { value: 'sports', label: 'Sports' },
  { value: 'photography', label: 'Photography' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'music', label: 'Music' },
  { value: 'dancing', label: 'Dancing' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'painting', label: 'Painting' },
  { value: 'coding', label: 'Coding' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' }
];
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const SendForm = new FormData();


    const fields = [
      'firstName', 'lastName', 'gender', 'email', 'password',
      'city', 'state', 'zip', 'country'
    ];

    fields.forEach(field => {
      if (formData[field]) SendForm.append(field, formData[field]);
    });

    if (formData.profileImage) {
      SendForm.append('profileImage', formData.profileImage);
    }

formData.activity.forEach((act)=>
     SendForm.append('activity[]', act)
)

    if (editData?._id) {
      await EditUser(editData._id, SendForm);
    } else {
      const errors = ValidateForm(formData);
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach(toast);
        return;
      }
      await SignupApi(SendForm, navigate);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setIsSubmitting(false);
  }
};
  useEffect(() => {
    if (editData?._id) {
      setFormData({
        firstName: editData.firstName || '',
        lastName: editData.lastName || '',
        email: editData.email || '',
        activity: editData.activity || [],
        country: editData.country || '',
        city: editData.city || '',
        state: editData.state || '',
        gender: editData.gender || '',
        zip: editData.zip || '',
      });
    }
  }, [editData]);

  return (
    <div className="relative no-scrollbar w-full h-screen rounded-lg shadow-md bg-white">

      <div className="absolute inset-0 z-0 bg-blue-500 ">
        <div className=' flex  ml-20 items-center h-screen text-gray-100'>

          <div className='w-2/6'>
            <h2 className='text-3xl font-mono font-bold '>Welcome To User Registration</h2>
            Join thousands of happy users who trust us to deliver excellence. Sign up now and experience the difference!

          </div>
        </div>
        {/* <img
      src="/leftImage.jpg" // ✅ Replace this with your own image
      alt="Register Illustration"
      className="w-full h-full object-cover"
    /> */}
      </div>


      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 z-10 bg-white bg-opacity-90 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-6">
          <div className="max-w-lg w-full  rounded-lg">
            <h2 className="text-4xl mb-8 font-semibold text-center">Signup</h2>
            <form onSubmit={handleSubmit} className='border-gray-100 border-2'>


              <div className="flex gap-2">
                <InputText type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value, setFormData)} />
                <InputText type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value, setFormData)} />
              </div>


              <div className="flex gap-4 py-2">
                <InputText type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="male" />
                <label htmlFor="male" className="text-sm">Male</label>

                <InputText type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="female" />
                <label htmlFor="female" className="text-sm">Female</label>

                <InputText type="radio" name="gender" value="other" checked={formData.gender === "other"} onChange={(e) => handleChange("gender", e.target.value, setFormData)} id="other" />
                <label htmlFor="other" className="text-sm">Other</label>
              </div>


              <InputText type="email" placeholder="Email" name="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value, setFormData)} />


              <div className="flex gap-3">
                <InputText type="password" placeholder="Password" name="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value, setFormData)} />
                <InputText type="password" placeholder="Confirm" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value, setFormData)} />
              </div>


              <div className="flex gap-3">
                <InputText type="text" placeholder="City" name="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value, setFormData)} />
                <div className="flex-1">
                  <Dropdown options={stateOption} selectedValue={formData.state} onChange={(e) => handleChange("state", e.target.value, setFormData)} label="State" />
                </div>
              </div>

              <div className="flex gap-3">
                <InputText type="text" placeholder="Zip" name="zip" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value, setFormData)} />
                <div className="flex-1">
                  <Dropdown options={countryOptions} selectedValue={formData.country} onChange={(e) => handleChange("country", e.target.value, setFormData)} label="Country" />
                </div>
              </div>


              <div className="pt-2">
              <Checkbox
  fieldName="activity"
  options={activityOptions}
  selectedValues={formData.activity || []}
  onChange={handleChange}
  setFormData={setFormData}
/>
</div>


              <FileUpload name="profileImage" onChange={handleChange} preview={false} setFormData={setFormData} />

        
              <SubmitButton type="submit" className="w-full mt-4">
                {isSubmitting ? "Saving..." : "Submit"}
              </SubmitButton>
            </form>

            <p className="mt-4 text-sm text-center">
              Already registered? <Link to="/" className="text-blue-600 underline">Login Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}