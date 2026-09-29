import React, { useState } from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { Card, Input, Button, IconButton, Badge, EmptyState, PageHeader, ConfirmDialog, Modal } from "@/components/ui";

const emptyForm = { name: "", email: "", role: "" };

const UserPage = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const isManager = user.role === "manager";

  const resetForm = () => {
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const { name, email, role } = formData;
    if (!name || !email || !role) {
      showToast("Please fill all fields", "error");
      return;
    }

    const newUser = { id: Date.now().toString(), name, email, role };
    updateData("users", [...data.users, newUser]);
    showToast("User added successfully!", "success");
    resetForm();
  };

  const confirmRemove = () => {
    updateData("users", data.users.filter((u) => u.id !== deletingUser.id));
    showToast("User removed successfully!", "success");
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="People with access to the onboarding portal."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add user
            </Button>
          )
        }
      />

      {!Array.isArray(data.users) || data.users.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No users added yet"
          description={isManager ? "Add a manager or employee to grant them portal access." : "No users have been added yet."}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first user
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.users.map((u) => (
            <Card key={u.id} hover>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{u.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
                {isManager && (
                  <IconButton icon={Trash2} label={`Remove ${u.name}`} variant="danger" onClick={() => setDeletingUser(u)} />
                )}
              </div>
              <Badge variant="info" withIcon={false} className="mt-3 capitalize">
                {u.role}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title="Add user">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Role<span className="ml-0.5 text-red-500">*</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {["Manager", "Employee"].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={formData.role === r}
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    formData.role === r
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Add {formData.role || "user"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmRemove}
        title="Remove user?"
        description={`This will revoke ${deletingUser?.name ?? "this user"}'s access to the portal.`}
        confirmLabel="Remove"
      />
    </div>
  );
};

export default UserPage;
