import axios from "axios";
import { toast } from "react-toastify";


export const SignupApi = async (formData,navigate, signVal, setValue) => {

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}api/submit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Registration successfull")
    if(signVal === true){
 setValue("Home")
    }
else{
  navigate("/")
}
    return response;
  } catch (error) {
toast.error(error?.response?.data?.error?.message
);
  }
};
