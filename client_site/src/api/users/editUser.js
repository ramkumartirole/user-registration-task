import axios from "axios";
import { toast } from "react-toastify";


export const EditUser = async (id,formData) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}edit-user/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }

    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something wrong"
    );

  }
};
