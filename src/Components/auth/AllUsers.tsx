import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authService } from '../../service/auth.service';
import { toast } from 'react-hot-toast';
import { Users, Shield, User, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserData {
  id: string;
  name: string;
  code: string;
  role: string;
  createdAt: string;
}

function AllUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('register.accessDenied')}</h2>
          <p className="text-gray-600">{t('users.adminOnlyView')}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getAllUsers(token);
      if (res?.success) {
        setUsers(res.data || []);
      } else {
        toast.error(res?.message || t('users.fetchFailed'));
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('users.fetchFailed');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-5 h-5 text-yellow-600" />;
      case 'DISTRICT_USER':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'VIDHANSABHA_USER':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'LOKSABHA_USER':
        return <User className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DISTRICT_USER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VIDHANSABHA_USER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LOKSABHA_USER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 mt-[12vh] md:mt-[20vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('users.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 mt-[12vh] md:mt-[20vh]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">{t('users.title')}</h1>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {users.length} {t('users.usersCount')}
            </span>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('users.noUsersTitle')}</h3>
              <p className="text-gray-500">{t('users.noUsersDesc')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('users.name')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('users.code')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('users.role')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('users.created')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr key={userData.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{userData.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded">
                          {userData.code}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(userData.role)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(userData.role)}`}>
                            {userData.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;