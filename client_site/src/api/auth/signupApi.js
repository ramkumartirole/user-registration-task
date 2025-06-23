import axios from "axios";
import { toast } from "react-toastify";


export const SignupApi = async (formData) => {

  try {
    const response = await axios.post("http://localhost:8000/api/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Registration successfull")
    return response;
  } catch (error) {
toast.error(error?.response?.data?.error?.message
);
  }
};
