import axios from "axios";
import { toast } from "react-toastify";
import { getUsers } from "./getAllUsers";
import {setUserData} from "../../redux/slice/UserData"


export const DeleteUser = async (id,dispatch) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}delete-user/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      }

    });
    const result = await getUsers()
    dispatch(setUserData(result.allUser))
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something wrong"
    );

  }
};
