
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setError, setLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(formData);
      setToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={useAuthStore.getState().isLoading}
              className="btn-primary w-full"
            >
              {useAuthStore.getState().isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
