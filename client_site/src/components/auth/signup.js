import React, { useState } from 'react';
import InputText from '../inputFields/inputText';
import Dropdown from '../inputFields/dropdown';
import Checkbox from '../inputFields/checkBox';
import FileUpload from '../inputFields/fileUpload';
import SubmitButton from '../button/submitButton';
import { SignupApi } from '../../api/auth/signupApi';

export default function Signup() {
     const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "" ,
        email:"",
        password:"",
        confirmPassword:"",
        city:"",
        state:"",
        zip:"",
        country:"",
        activity:[],
        profileImage:null
    });
    const stateOption = [
        { value: 'volvo', label: 'Volvo' },
        { value: 'saab', label: 'Saab' },
        { value: 'fiat', label: 'Fiat' },
        { value: 'audi', label: 'Audi' },
    ];
     const countryOptions = [
    { value: 'pk', label: 'Pakistan' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ];
   const carOptions = [
    { value: 'volvo', label: 'Volvo' },
    { value: 'saab', label: 'Saab' },
    { value: 'fiat', label: 'Fiat' },
    { value: 'audi', label: 'Audi' },
  ];
  const SendForm = new FormData()
  SendForm.append("firstName",formData.firstName)
  SendForm.append("lastName",formData.lastName)
  SendForm.append("gender",formData.gender)
  SendForm.append("email",formData.email)
  SendForm.append("password",formData.password)
  SendForm.append("city",formData.city)
  SendForm.append("state",formData.state)
  SendForm.append("zip",formData.zip)
  SendForm.append("country",formData.country)
  SendForm.append("profileImage",formData.profileImage)
  formData.activity.forEach((act)=>
SendForm.append("activity",act))

const handleSubmit =async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

  const res = await SignupApi(SendForm)
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Form submitted!');
    }, 2000);
  };
    const handleChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };
    // console.log(formData)
    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit}>
                {/* Other fields... */}

                <div className=" gap-4">
                    <InputText
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        value={formData.email}
                    />
                    <InputText
                        type="text"
                        placeholder="Last Name"
                        name="lastName"

                        value={formData.email}
                        onChange={(e) => handleChange("lastName", e.target.value)}

                    />
                    <InputText
                        type="radio"
                        placeholder="Male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        id="male"
                    />

                    <InputText
                        type="radio"
                        placeholder="Female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        id="female"
                    />

                    <InputText
                        type="radio"
                        placeholder="Other"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        id="other"
                    />
                    <InputText
                        type="text"
                        placeholder="Email"
                        name="email"
                        // value={formData.email}

                        onChange={(e) => handleChange("email", e.target.value)}
                        id="email"
                    />
                    <InputText
                        type="password"
                        placeholder="Password"
                        name="password"
                        // value={formData.email}

                        onChange={(e) => handleChange("password", e.target.value)}
                        id="epasswordmail"
                    />
                    <InputText
                        type="password"
                        placeholder="confirmPassword"
                        name="confirmPassword"
                        // value={formData.email}

                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        id="confirmPassword"
                    />
                    <InputText
                        type="text"
                        placeholder="City"
                        name="city"
                        // value={formData.email}

                        onChange={(e) => handleChange("city", e.target.value)}
                        id="city"
                    />
                    <Dropdown
                        label="Select your state:"
                        options={stateOption}
                        selectedValue={formData.city}
                        onChange={(e) => handleChange("state", e.target.value)}
                    />
                      <InputText
                        type="text"
                        placeholder="Zip"
                        name="zip"
                        // value={formData.email}

                        onChange={(e) => handleChange("zip", e.target.value)}
                        id="zip"
                    />
                      <Dropdown
                        label="Select your Country:"
                        options={countryOptions}
                        selectedValue={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                    />
                   <Checkbox
        fieldName="activity"
        label="Your Activities:"
        options={carOptions}
        selectedValues={formData.activity}
        onChange={handleChange}// Important for form handling
      />
         <FileUpload
        label="Profile Picture"
        name="profileImage"
        onChange={handleChange}
      />
       <SubmitButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          Submit Form
        </SubmitButton>
                </div>
            </form>
        </div>
    );
}