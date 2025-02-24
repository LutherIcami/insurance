import { useEffect, useState } from "react";

// Define User Type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]); // Set the correct type
  const [editingUser, setEditingUser] = useState<User | null>(null); // Store the user to edit
  const [updatedRole, setUpdatedRole] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data: User[] = await res.json(); // Ensure correct typing
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Handle deleting a user
  const handleDelete = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Handle editing a user
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUpdatedRole(user.role);
  };

  // Handle saving the updated user
  const handleSaveEdit = async () => {
    if (editingUser) {
      await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...editingUser, role: updatedRole }),
        headers: { "Content-Type": "application/json" },
      });

      // Update users state with the edited user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...editingUser, role: updatedRole } : user)));

      // Reset editing user state
      setEditingUser(null);
      setUpdatedRole("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">User Management</h1>
        
        {/* Table Container */}
        <div className="overflow-hidden bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{user.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {editingUser?.id === user.id ? (
                      <select
                        value={updatedRole}
                        onChange={(e) => setUpdatedRole(e.target.value)}
                        className="border p-1"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 space-x-2">
                    {editingUser?.id === user.id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
