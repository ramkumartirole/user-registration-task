import axios from "axios";
import { toast } from "react-toastify";


export const ChangePasswordApi = async (formData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}admin/change-password`, formData, {
      withCredentials: true,
    });
    toast.success("data update")
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something wrong"
    );

  }
};
