import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    // 🔸 Validasi sederhana
    if (!username || !email || !password) {
      toast.warn("Semua field harus diisi!");
      return;
    }

    try {
      await api.post("/auth/register", form);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      toast.error("Registrasi gagal! Email mungkin sudah terdaftar.");
      console.error(err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h4 className="text-center mb-3">Register</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Register;
