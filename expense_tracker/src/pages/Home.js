import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseInput, setExpenseInput] = useState({ title: "", amount: "" });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Load user and their expenses
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) navigate("/login");

    setLoggedInUser(user);

    // Load expenses for the logged-in user
    const saved = localStorage.getItem(`expenses_${user}`);
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, [navigate]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem(
        `expenses_${loggedInUser}`,
        JSON.stringify(expenses)
      );
    }
  }, [expenses, loggedInUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged Out");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseInput({ ...expenseInput, [name]: value });
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    const { title, amount } = expenseInput;

    if (!title || !amount) return handleError("Title and Amount required");

    if (editId !== null) {
      const updated = expenses.map((exp) =>
        exp.id === editId ? { ...exp, title, amount } : exp
      );
      setExpenses(updated);
      handleSuccess("Expense updated");
      setEditId(null);
    } else {
      const newExp = { id: Date.now(), title, amount };
      setExpenses([...expenses, newExp]);
      handleSuccess("Expense added");
    }

    setExpenseInput({ title: "", amount: "" });
  };

  const handleDelete = (id) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    handleSuccess("Expense deleted");
  };

  const handleEdit = (exp) => {
    setExpenseInput({ title: exp.title, amount: exp.amount });
    setEditId(exp.id);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Welcome, {loggedInUser}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="expense-form">
          <form onSubmit={handleAddOrEdit}>
            <input
              type="text"
              placeholder="Expense Title"
              name="title"
              value={expenseInput.title}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={expenseInput.amount}
              onChange={handleChange}
            />
            <button type="submit">
              {editId !== null ? "Update" : "Add"} Expense
            </button>
          </form>
        </div>

        <div className="expense-table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.amount}</td>
                  <td className="table-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;
