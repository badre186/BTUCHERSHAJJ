import React, { useState } from 'react';
import { ArrowLeft, Lock, User } from 'lucide-react';

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'ALFAROUQ') {
      setError('');
      onEnter();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="الكعبة المشرفة"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
              <div className="flex items-center gap-8 mb-8"></div>
              <h1 className="text-4xl font-bold mb-4">
                مشروع المملكة العربية السعودية للإفادة من الهدي والأضاحي
              </h1>
              <p className="text-xl mb-8">
                إدارة البنك الإسلامي للتنمية
              </p>
              <h2 className="text-2xl font-semibold mb-4">
                مؤسسة محمد علي ظافر الشهراني بشراكة مع 
              </h2>
              <h3>
                <img
                  src="https://alfarouktravel.ma/upload/settings/agency_logo.png?v=66f00b541b0e3"
                  alt="Agency Logo"
                  className="w-30 h-10"
                />
              </h3>
              <h4>
                <img
                  src="https://scontent.frak2-2.fna.fbcdn.net/v/t39.30808-6/306999943_411326257783574_7894657690750126562_n.png?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-dDYXkB0ugYQ7kNvgE8V7nR&_nc_zt=23&_nc_ht=scontent.frak2-2.fna&_nc_gid=A5PZJCkmAzYqlV8DGPjJn-D&oh=00_AYASYLZgh50zYCHwJzba7g9n9JGn_KAz0JxkZ0ocOe9-JQ&oe=6736A266"
                  alt="Agency Logo"
                  className="w-14 h-14"
                />
              </h4>
              <h5 className="text-3xl font-bold text-yellow-400 mb-8">
                اختبارات انتقاء الجزارين والعمال
              </h5>

              {!showLogin ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-yellow-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <Lock size={24} />
                  تسجيل الدخول
                </button>
              ) : (
                <div className="bg-white/20 backdrop-blur-md p-8 rounded-lg max-w-md w-full">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">اسم المستخدم</label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={credentials.username}
                          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                          className="w-full pr-10 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-white/60"
                          placeholder="أدخل اسم المستخدم"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="password"
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                          className="w-full pr-10 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-white/60"
                          placeholder="أدخل كلمة المرور"
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={20} />
                        دخول
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLogin(false)}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}