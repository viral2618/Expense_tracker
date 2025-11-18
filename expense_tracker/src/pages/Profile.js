import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    const email = localStorage.getItem("email");
    setUser(name || "User");
    setEmail(email || "");
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword)
      return handleError("Both fields required!");

    try {
      const response = await fetch("http://localhost:8080/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      data.success ? handleSuccess(data.message) : handleError(data.message);
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return handleError("Your email not found!");
    try {
      const response = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      data.success ? handleSuccess(data.message) : handleError(data.message);
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        <h1>Profile</h1>

        <div className="profile-info">
          <p><strong>Name:</strong> {user}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>Update Password</button>

        <hr />

        <h3>Forgot Password?</h3>

        <button className="forgot-btn" onClick={handleForgotPassword}>
          Send Reset Email
        </button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Profile;
