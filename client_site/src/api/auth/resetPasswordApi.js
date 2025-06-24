import axios from "axios";
import { toast } from "react-toastify";


export const ResetPasswordApi = async (formData,navigate) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}reset-password`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    toast.success(response.data.message)
       navigate("/")
    return response;
  } catch (error) {
    toast.error(error.response.data.message)
  }
};
