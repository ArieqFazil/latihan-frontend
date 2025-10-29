import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      toast.warn("Email dan password wajib diisi!");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch {
      toast.error("Email atau password salah!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h4 className="text-center mb-3">Login</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
