import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

const UserPage = ({ showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [roleChoice, setRoleChoice] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [users, setUsers] = useState([]);

  // ✅ Fetch users from backend on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        showToast("Failed to load users", "error");
      }
    };

    fetchUsers();
  }, []);

  // ✅ Add user to backend
  const handleAddUser = async () => {
    const { name, email } = formData;

    if (!name || !email || !roleChoice) {
      showToast("Please fill all fields", "error");
      return;
    }

    const newUser = { name, email, role: roleChoice };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const savedUser = await res.json();
      if (!res.ok) throw new Error(savedUser.message);

      setUsers((prev) => [...prev, savedUser]);
      showToast("User added successfully!", "success");

      // Reset form
      setFormData({ name: "", email: "" });
      setRoleChoice("");
      setShowForm(false);
    } catch (err) {
      console.error("❌ Add error:", err);
      showToast(err.message || "Failed to add user", "error");
    }
  };

  // ✅ Delete user from backend
  const handleRemoveUser = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("User removed successfully!", "success");
    } catch (err) {
      console.error("❌ Delete error:", err);
      showToast("Failed to remove user", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h2>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} />
          {showForm ? "Cancel" : "Add User"}
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-xl shadow bg-gray-100 dark:bg-gray-800 space-y-4">
          <div className="flex gap-4">
            <Button
              variant={roleChoice === "Manager" ? "default" : "outline"}
              onClick={() => setRoleChoice("Manager")}
            >
              Manager
            </Button>
            <Button
              variant={roleChoice === "Employee" ? "default" : "outline"}
              onClick={() => setRoleChoice("Employee")}
            >
              Employee
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                placeholder="Enter email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <Button className="w-full mt-2" onClick={handleAddUser}>
            Add {roleChoice || "User"}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <Card key={u._id} className="p-4 space-y-2 shadow rounded-2xl">
            <h3 className="text-lg font-semibold">{u.name}</h3>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{u.role}</p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => handleRemoveUser(u._id)}
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
