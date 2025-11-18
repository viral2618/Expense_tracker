import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Get user info from localStorage (after login)
    const token = localStorage.getItem("token");
    if (!token) return handleError("User not logged in");

    const storedName = localStorage.getItem("loggedInUser") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setName(storedName);
    setEmail(storedEmail);
  }, []);

  // Update profile name/email
  const handleUpdateProfile = async () => {
    if (!name || !email) return handleError("Name and Email are required");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (data.success) {
        handleSuccess("Profile updated successfully");
        // Update localStorage
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("email", email);
      } else {
        handleError(data.message || "Failed to update profile");
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return handleError("Both fields are required");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        handleSuccess(data.message);
        setOldPassword("");
        setNewPassword("");
      } else {
        handleError(data.message || "Failed to change password");
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!email) return handleError("Email not found");
    try {
      const res = await fetch("http://localhost:8080/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) handleSuccess(data.message);
      else handleError(data.message || "Failed to send password assistance email");
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile</h1>

        <div className="profile-info">
          <label>
            <strong>Name:</strong>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>
            <strong>Email:</strong>
          </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleUpdateProfile}>Update Profile</button>
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

        <h3>Forgot Password?</h3>
        <button onClick={handleForgotPassword}>Send Password Assistance Email</button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Profile;
