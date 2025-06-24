import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordApi } from '../../api/auth/resetPasswordApi';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const { token: pathToken } = useParams();
  const { search } = useLocation();
  const queryToken = new URLSearchParams(search).get('token');
  const token = pathToken || queryToken;
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Password not match")
      return;
    }

    setIsLoading(true);

    try {
      const res = await ResetPasswordApi({
        token: token,
        newPassword: newPassword
      }, navigate)

    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

      </div>
    </div>
  );
}