import axios from 'axios';
export async function Logout(navigate) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}api/logout`,{
                withCredentials: true
            }
        );

        if (response.status === 200) {

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate("/");
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}