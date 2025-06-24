import axios from "axios";
import { toast } from "react-toastify";


export const ForgetPasswordApi = async (formData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}forgot-password`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    toast.success(response.data.message)
    return response;
  } catch (error) {
    toast.error(error.response.data.message)
  }
};
