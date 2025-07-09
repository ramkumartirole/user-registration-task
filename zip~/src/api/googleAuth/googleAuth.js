// import axios from 'axios';


// const googleAuth = async (code, setToken, setUser, navigate) => {
//     try {
//         const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/google`, { code });
//         if (response.data.token) {
//             setToken(response.data.token);
//             setUser(response.data.user);
//             navigate('/profile');
//         }
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
// export default googleAuth;