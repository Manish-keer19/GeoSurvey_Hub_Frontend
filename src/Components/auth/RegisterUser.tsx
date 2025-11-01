import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { authService } from '../../service/auth.service';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Role = 'ADMIN' | 'DISTRICT_USER' | 'VIDHANSABHA_USER' | 'LOKSABHA_USER';

type FormData = {
  name: string;
  code: string;
  role: Role | '';
};

function RegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange'
  });

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('register.accessDenied')}</h2>
          <p className="text-gray-600">{t('register.adminOnly')}</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const res = await authService.registerUser(data, token);

      if (res?.success) {
        toast.success(res.message || t('register.success'));
        reset();
      } else {
        toast.error(res?.message || t('register.failed'));
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('register.failed');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 mt-[12vh] md:mt-[20vh]">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t('register.title')}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {t('register.subtitle')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Name can only contain letters and spaces'
                }
              })}
              type="text"
              placeholder="Enter full name"
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)();
                }
              }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              4-Digit Code
            </label>
            <input
              {...register('code', {
                required: 'Code is required',
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Enter exactly 4 digits',
                },
                validate: {
                  notAllSame: (value) => {
                    if (value && value.length === 4) {
                      const allSame = value.split('').every(digit => digit === value[0]);
                      return !allSame || 'Code cannot be all same digits (e.g., 1111)';
                    }
                    return true;
                  }
                }
              })}
              type="text"
              maxLength={4}
              placeholder="0000"
              disabled={isLoading}
              className="w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border-2 border-gray-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length === 4) {
                  trigger('code');
                }
              }}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register('role', {
                required: 'Please select a role',
                validate: {
                  notEmpty: (value) => value !== '' || 'Please select a valid role'
                }
              })}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)();
                }
              }}
            >
              <option value="">Select Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DISTRICT_USER">DISTRICT_USER</option>
              <option value="VIDHANSABHA_USER">VIDHANSABHA_USER</option>
              <option value="LOKSABHA_USER">LOKSABHA_USER</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 flex items-center justify-center"
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
                {t('register.registering')}
              </span>
            ) : (
              t('register.registerButton')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;