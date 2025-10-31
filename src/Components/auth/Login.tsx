import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../service/auth.service';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-hot-toast';

type Role = 'ADMIN' | 'DISTRICT_USER' | 'VIDHANSABHA_USER';

type FormData = {
  role: Role;
  code: string;
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: { role: 'ADMIN' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Payload exactly as you asked
      const payload = {
        role: data.role,
        code: data.code,
      };

      const res = await authService.login(payload);

      if (res?.success) {
        dispatch(
          loginSuccess({ token: res.data.token, user: res.data.user })
        );
        toast.success(res.message || 'Login successful!');
        reset();
        navigate('/reports');
      } else {
        const msg = res?.message || 'Invalid role or code.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Network error. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Select your role and enter the 4-digit code
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register('role', { required: 'Please select a role' })}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DISTRICT_USER">DISTRICT_USER</option>
              <option value="VIDHANSABHA_USER">VIDHANSABHA_USER</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* 4-Digit Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              {...register('code', {
                required: 'Code is required',
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Enter exactly 4 digits',
                },
              })}
              type="text"
              maxLength={4}
              placeholder="0000"
              disabled={isLoading}
              className="w-full px-4 py-4 text-center text-3xl font-mono tracking-widest border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none transition-all disabled:opacity-70"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              autoFocus
            />
            {errors.code && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Global error */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in…
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;