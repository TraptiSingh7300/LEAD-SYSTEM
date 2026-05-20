"use client";
import { useState } from "react";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    serviceType: "Service 1",
    description: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit lead.");
      }

      setMessage({
        text: `🎉 Success! Assigned to: ${data.assignedProvider}`,
        isError: false,
      });

      setFormData({
        name: "",
        phone: "",
        city: "",
        serviceType: "Service 1",
        description: "",
      });
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    color: "#333",
  };

  return (
    <main
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "550px",
        margin: "40px auto",
        background: "#fafafa",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h1
        style={{
          borderBottom: "2px solid #0070f3",
          paddingBottom: "10px",
          color: "#333",
          marginTop: "0",
        }}
      >
        New Lead Intake Form
      </h1>
      <p style={{ color: "#666", marginBottom: "25px" }}>
        Fill out the details below to find your matching service providers.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={inputStyle}
          />
        </div>

        {}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1234567890"
            style={inputStyle}
          />
        </div>

        {}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. New York"
            style={inputStyle}
          />
        </div>

        {}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            Service Type Required *
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            style={{ ...inputStyle, background: "#fff" }}
          >
            <option value="Service 1">Service 1</option>
            <option value="Service 2">Service 2</option>
            <option value="Service 3">Service 3</option>
          </select>
        </div>

        {}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            Project Description (Optional)
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you need help with..."
            style={{
              ...inputStyle,
              fontFamily: "sans-serif",
              resize: "vertical",
            }}
          />
        </div>

        {}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            background: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          {loading ? "Finding Matching Providers..." : "Submit & Match Lead"}
        </button>
      </form>

      {}
      {message.text && (
        <div
          style={{
            marginTop: "25px",
            padding: "14px",
            borderRadius: "4px",
            background: message.isError ? "#fef2f2" : "#f0fdf4",
            color: message.isError ? "#991b1b" : "#166534",
            border: `1px solid ${message.isError ? "#fca5a5" : "#bbf7d0"}`,
            fontWeight: "500",
          }}
        >
          {message.text}
        </div>
      )}
    </main>
  );
}
