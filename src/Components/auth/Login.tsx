import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../service/auth.service';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess, setTempSelectedReport } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Role = 'ADMIN' | 'DISTRICT_USER' | 'VIDHANSABHA_USER' | 'LOKSABHA_USER';
type Reports = 'Mahatari Vandan Yojana Report' | 'Call Center Report' | 'WhatsApp/OBD/SMS Report';
type FormData = {
  role: Role;
  code: string;
  reports: Reports;
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: { role: 'ADMIN', reports: 'Mahatari Vandan Yojana Report' },
  });

  const selectedReport = watch('reports');
  
  // Update navbar in real-time when report selection changes
  React.useEffect(() => {
    dispatch(setTempSelectedReport(selectedReport));
  }, [selectedReport, dispatch]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Payload exactly as you asked
      const payload = {
        role: data.role,
        code: data.code,
        reports: data.reports,
      };

      const res = await authService.login(payload);

      if (res?.success) {
        dispatch(
          loginSuccess({ 
            token: res.data.token, 
            user: res.data.user,
            selectedReport: data.reports
          })
        );
        toast.success(res.message || t('login.success'));
        reset();
        navigate('/reports');
      } else {
        
        const msg = res?.message || 'Invalid role or code.';
        setError(msg);
        console.log("msg",msg)
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('login.networkError');
      setError(msg);
      console.log("msg",msg)
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#EF7808'}}>
          {t('login.title')}
        </h2>
        <p className="text-center mb-4" style={{color: '#EF7808'}}>
          {t('login.subtitle')}
        </p>
        

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Reports Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#EF7808'}}>
              {t('login.reports')}
            </label>
            <select
              {...register('reports', { required: t('login.selectReports') })}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
            >
              <option value="Mahatari Vandan Yojana Report">{t('reports.mahatariVandan')}</option>
              <option value="Call Center Report">{t('reports.callCenter')}</option>
              <option value="WhatsApp/OBD/SMS Report">{t('reports.whatsappObd')}</option>
            </select>
            {errors.reports && (
              <p className="mt-1 text-sm text-red-600">{errors.reports.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#EF7808'}}>
              {t('login.role')}
            </label>
            <select
              {...register('role', { required: t('login.selectRole') })}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
            >
              <option value="ADMIN">{t('common.admin')}</option>
              <option value="DISTRICT_USER">{t('common.districtUser')}</option>
              <option value="VIDHANSABHA_USER">{t('common.vidhansabhaUser')}</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* 4-Digit Code */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#EF7808'}}>
              {t('login.code')}
            </label>
            <input
              {...register('code', {
                required: t('login.codeRequired'),
                pattern: {
                  value: /^\d{4}$/,
                  message: t('login.exactDigits'),
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)();
                }
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
            className="w-full py-3 text-white font-semibold text-lg rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-orange-600"
            style={{backgroundColor: '#EF7808'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d66a07'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#EF7808'}
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
                {t('login.loggingIn')}
              </span>
            ) : (
              t('login.loginButton')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;