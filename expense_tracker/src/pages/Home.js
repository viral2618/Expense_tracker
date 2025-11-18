import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleDateString();
};

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionInput, setTransactionInput] = useState({
    title: "",
    amount: "",
    type: "Expense",
  });
  const [editId, setEditId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "descending" });
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  // Fetch transactions
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
      else handleError(data.message || "Failed to fetch transactions");
    } catch (err) {
      handleError(err.message);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");
    if (!user || !token) navigate("/login");
    setLoggedInUser(user);
    fetchTransactions();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("email");
    handleSuccess("User Logged Out");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleGoProfile = () => {
    navigate("/profile"); // Navigate to profile page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionInput({ ...transactionInput, [name]: value });
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const { title, amount, type } = transactionInput;
    if (!title || !amount || !type) return handleError("Title, Amount, Type required");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return handleError("Amount must be positive");

    const token = localStorage.getItem("token");

    try {
      let res, data;
      if (editId) {
        res = await fetch(`http://localhost:8080/transactions/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, amount: numericAmount, type }),
        });
        data = await res.json();
        if (data.success) {
          handleSuccess("Transaction updated");
          fetchTransactions();
          setEditId(null);
        } else handleError(data.message || "Update failed");
      } else {
        res = await fetch("http://localhost:8080/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, amount: numericAmount, type }),
        });
        data = await res.json();
        if (data.success) {
          handleSuccess("Transaction added");
          fetchTransactions();
        } else handleError(data.message || "Add failed");
      }
    } catch (err) {
      handleError(err.message);
    }

    setTransactionInput({ title: "", amount: "", type: "Expense" });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        handleSuccess("Transaction deleted");
        fetchTransactions();
      } else handleError(data.message || "Delete failed");
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleEdit = (t) => {
    setTransactionInput({ title: t.title, amount: t.amount, type: t.type });
    setEditId(t._id);
  };

  const sortItems = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        switch (sortConfig.key) {
          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;
          case "type":
          case "title":
            aValue = String(a[sortConfig.key]).toLowerCase();
            bValue = String(b[sortConfig.key]).toLowerCase();
            break;
          case "date":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          default:
            return 0;
        }
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return sortedTransactions;
    return sortedTransactions.filter((t) => t.type.toLowerCase() === filterType);
  }, [sortedTransactions, filterType]);

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Welcome, {loggedInUser}</h1>
          <div>
            <button onClick={handleGoProfile}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="expense-form">
          <form onSubmit={handleAddOrEdit}>
            <input
              type="text"
              placeholder="Title/Description"
              name="title"
              value={transactionInput.title}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={transactionInput.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
            <select name="type" value={transactionInput.type} onChange={handleChange} required>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <button type="submit">{editId ? "Update" : "Add"} Transaction</button>
          </form>
        </div>

        <div className="expense-table-container">
          <h2>Recent Transactions</h2>
          <div className="filter-container">
            <label>Filter by Type: </label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <table className="expense-table">
            <thead>
              <tr>
                <th onClick={() => sortItems("title")}>Description{getSortIndicator("title")}</th>
                <th onClick={() => sortItems("type")}>Type{getSortIndicator("type")}</th>
                <th onClick={() => sortItems("amount")}>Amount (₹){getSortIndicator("amount")}</th>
                <th onClick={() => sortItems("date")}>Date{getSortIndicator("date")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id} className={t.type === "Income" ? "income-row" : "expense-row"}>
                  <td>{t.title}</td>
                  <td>{t.type}</td>
                  <td>{t.amount.toFixed(2)}</td>
                  <td>{formatDate(t.createdAt)}</td>
                  <td className="table-actions">
                    <button className="edit-btn" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(t._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && <p className="no-transactions">No transactions recorded.</p>}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;
