import axios from "axios";


export const SignupApi = async (formData) => {
  console.log()
  try {
    const response = await axios.post("http://localhost:8000/api/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload API Error:", error);
    throw error;
  }
};
