import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";

const Main = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/users/getAllUsers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/users/deleteUser/${id}`);
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:8080/api/users/deleteUser/${id}`);
    setUsers(users.filter((user) => user._id !== id));
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again.");
  }
};



  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      state: user.state,
      country: user.country,
      areaOfInterest: user.areaOfInterest,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/users/updateUser/${id}`, editedUser);
      fetchUsers(); // refresh list
      setEditingUserId(null); // exit edit mode
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>User List</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.grid_container}>
        {users.map((user) => (
          <div key={user._id} className={styles.card}>
            {editingUserId === user._id ? (
              <>
                <input name="firstName" value={editedUser.firstName} onChange={handleInputChange} />
                <input name="lastName" value={editedUser.lastName} onChange={handleInputChange} />
                <input name="city" value={editedUser.city} onChange={handleInputChange} />
                <input name="state" value={editedUser.state} onChange={handleInputChange} />
                <input name="country" value={editedUser.country} onChange={handleInputChange} />
                <input name="areaOfInterest" value={editedUser.areaOfInterest} onChange={handleInputChange} />
                <div className={styles.actions}>
                  <button onClick={() => handleSave(user._id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>City:</strong> {user.city}</p>
                <p><strong>State:</strong> {user.state}</p>
                <p><strong>Country:</strong> {user.country}</p>
                <p><strong>Area of Interest:</strong> {user.areaOfInterest}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
