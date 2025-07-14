
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";


const UserPage = ({ user, data, updateData, showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [roleChoice, setRoleChoice] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleAddUser = () => {
    const { name, email } = formData;

    if (!name || !email || !roleChoice) {
      showToast("Please fill all fields", "error");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: roleChoice,
    };

    updateData({ ...data, users: [...data.users, newUser] });
    showToast("User added successfully!", "success");

    // Reset
    setFormData({ name: "", email: "" });
    setRoleChoice("");
    setShowForm(false);
  };

  const handleRemoveUser = (id) => {
    const updatedUsers = data.users.filter((u) => u.id !== id);
    updateData({ ...data, users: updatedUsers });
    showToast("User removed successfully!", "success");
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
        {Array.isArray(data.users) &&
          data.users.map((u) => (
            <Card key={u.id} className="p-4 space-y-2 shadow rounded-2xl">
              <h3 className="text-lg font-semibold">{u.name}</h3>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{u.role}</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => handleRemoveUser(u.id)}
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