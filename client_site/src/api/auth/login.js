import axios from "axios";
import { toast } from "react-toastify";


export const LoginApi = async (formData,navigate) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}api/login`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    localStorage.setItem("user", JSON.stringify(response?.data?.user))
    localStorage.setItem("token", JSON.stringify(response?.data?.token))
    toast.success("login Successfull")
    navigate("/dashboard")
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message
    );

  }
};
