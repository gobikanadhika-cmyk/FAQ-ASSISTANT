import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");

  const [editingId, setEditingId] = useState(null);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);

      alert("Login successful!");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setFaqs([]);
  };

  // GET FAQS
  const getFaqs = async () => {
    try {
      const response = await axios.get("/api/faqs");
      setFaqs(response.data);
    } catch (error) {
      console.log("FAQ fetch error:", error);
    }
  };

  // LOAD FAQS
  useEffect(() => {
    if (isLoggedIn) {
      getFaqs();
    }
  }, [isLoggedIn]);

  // ADD / UPDATE FAQ
  const handleSubmitFAQ = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!question || !answer) {
      alert("Please enter question and answer");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `/api/faqs/${editingId}`,
          {
            question,
            answer,
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("FAQ updated successfully!");
      } else {
        await axios.post(
          "/api/faqs",
          {
            question,
            answer,
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("FAQ added successfully!");
      }

      setQuestion("");
      setAnswer("");
      setCategory("General");
      setEditingId(null);

      getFaqs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // EDIT
  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "General");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/api/faqs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("FAQ deleted successfully!");

      getFaqs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
  };

  // SEARCH
  const filteredFaqs = faqs.filter((faq) => {
    const text =
      `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const categoryCount = new Set(
    faqs.map((faq) => faq.category)
  ).size;

  // =========================
  // LOGIN PAGE
  // =========================
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">
            FAQ Assistant
          </h1>

          <p className="login-subtitle">
            Manage your frequently asked questions
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>

              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              className="primary-button"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-title">
          FAQ Assistant
        </div>

        <div className="sidebar-item active">
          📊 Dashboard
        </div>

        <div className="sidebar-item">
          ❓ FAQ Management
        </div>

        <div className="sidebar-item">
          ➕ Add FAQ
        </div>

        <div className="sidebar-item">
          ⚙️ Settings
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>

            <p className="page-description">
              Welcome back! Manage your FAQs from here.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-card">
            <p className="stat-label">
              Total FAQs
            </p>

            <h2 className="stat-value">
              {faqs.length}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Categories
            </p>

            <h2 className="stat-value">
              {categoryCount}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Status
            </p>

            <h2
              className="stat-value"
              style={{ color: "#16a34a" }}
            >
              Active
            </h2>
          </div>
        </div>

        {/* ADD / EDIT FAQ */}
        <section className="content-card">
          <h2 className="card-title">
            {editingId
              ? "Edit FAQ"
              : "Add New FAQ"}
          </h2>

          <form onSubmit={handleSubmitFAQ}>
            <div className="form-group">
              <label>Question</label>

              <input
                className="form-input"
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Answer</label>

              <textarea
                className="form-input"
                placeholder="Enter the answer"
                rows="5"
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                className="form-input"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="General">
                  General
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Account">
                  Account
                </option>

                <option value="Support">
                  Support
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <button
              className="primary-button"
              type="submit"
              style={{ width: "auto", padding: "12px 25px" }}
            >
              {editingId
                ? "Update FAQ"
                : "Add FAQ"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* FAQ MANAGEMENT */}
        <section className="content-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <h2 className="card-title">
              FAQ Management
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No FAQs found.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="faq-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFaqs.map((faq) => (
                    <tr key={faq._id}>
                      <td>
                        <strong>
                          {faq.question}
                        </strong>
                      </td>

                      <td>{faq.answer}</td>

                      <td>
                        <span className="category-badge">
                          {faq.category}
                        </span>
                      </td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(faq)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              faq._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;