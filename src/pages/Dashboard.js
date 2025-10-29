import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/api";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 Ambil data dari API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      toast.error("Gagal memuat data dari server!");
    }
  };

  // 🔹 Simpan data (Tambah/Edit)
  const handleSave = async () => {
    const { title, description } = form;
    if (!title || !description) {
      toast.warn("Judul dan deskripsi tidak boleh kosong!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await api.put(`/items/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Data berhasil diperbarui!");
      } else {
        await api.post("/items", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Data berhasil ditambahkan!");
      }

      setForm({ title: "", description: "" });
      setEditId(null);
      setShow(false);
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      toast.error("Terjadi kesalahan saat menyimpan data!");
    }
  };

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus data ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Data berhasil dihapus!");
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      toast.error("Gagal menghapus data!");
    }
  };

  // 🔹 Edit data
  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description });
    setEditId(item.id);
    setShow(true);
  };

  // 🔹 Ambil data pertama kali
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Dashboard</h3>
        <Button onClick={() => setShow(true)}>Tambah Data</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Tambah/Edit */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Data" : "Tambah Data"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Judul</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;
