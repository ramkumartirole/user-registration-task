// import styles from "./styles.module.css";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Main = () => {
// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		window.location.reload();
// 	};

// 	const [users, setUsers] = useState([]);

// // 	 useEffect(() => {
// //     // Call API to get all users
// //     const fetchUsers = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:8080/api/users/getAllUsers");
// //         setUsers(response.data);
// //         console.log("All users:", response.data);
// //       } catch (error) {
// //         console.error("Error fetching users:", error);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);


//   useEffect(() => {
//     // Call backend API to get users
//     axios.get("http://localhost:8080/api/users/getAllUsers")
//       .then((res) => {
//         setUsers(res.data); // 👈 store the DB data in state
//       })
//       .catch((err) => {
//         console.error("Failed to fetch users", err);
//       });
//   }, []);

// 	return (
// 		<div className={styles.main_container}>
// 			<nav className={styles.navbar}>
// 				<h1>User Details</h1>
// 				 <ul>
//         {users.map((user) => (
//           <li key={user._id}>{user.firstName} {user.lastName} - {user.email}</li>
//         ))}
//       </ul>
// 				<button className={styles.white_btn} onClick={handleLogout}>
// 					Logout
// 				</button>
// 			</nav>
// 		</div>
// 	);
// };

// export default Main;



import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";

const Main = () => {
  const [users, setUsers] = useState([]);

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // 📦 Fetch all users from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/getAllUsers")
	// .get("db.getCollection('users').find({});")
      .then((res) => {
		// console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>User List</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* 🧑‍💻 Grid display */}
      <div className={styles.grid_container}>
        {users.map((user) => (
          <div key={user._id} className={styles.card}>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>City:</strong> {user.city}</p>
            <p><strong>Country:</strong> {user.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
