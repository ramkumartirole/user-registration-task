import axios from "axios";
import { toast } from "react-toastify";


export const getUsers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}get-users`, {
  withCredentials: true,
});
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something wrong"
    );
  

  }
};
