import React, { useState } from 'react';
import { ChangePasswordApi } from '../../api/auth/changePassword';

export default function ChangePasswordModal({ id, setShowPassModal }) {
  const [password, setPassword] = useState("");

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
        const res = await ChangePasswordApi({
            userId:id,
            newPassword:password
        })
    } catch (error) {

    }

      setShowPassModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
       
        <button
          onClick={() => setShowPassModal(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowPassModal(false)}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
