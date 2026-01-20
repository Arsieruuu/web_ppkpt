"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminLaporanList, type Laporan, logout, getCurrentUser, isLoggedIn as checkAuth } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    dalam_proses: 0,
    verifikasi: 0,
    selesai: 0,
  });

  // First useEffect: Check auth and mount
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      const isLoggedIn = checkAuth();
      const storedUsername = localStorage.getItem("username");
      const storedFullName = localStorage.getItem("full_name");
      
      if (!isLoggedIn) {
        router.push("/");
        return;
      }
      
      setUsername(storedUsername || "Admin");
      setFullName(storedFullName || "");
    }
  }, [router]);

  // Second useEffect: Load data after mounted
  useEffect(() => {
    if (isMounted) {
      loadLaporanData();
    }
  }, [isMounted]);

  // Third useEffect: Update time
  useEffect(() => {
    if (!isMounted) return;
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, [isMounted]);

  const loadLaporanData = async () => {
    setIsLoading(true);
    
    // Set timeout to stop loading after 5 seconds
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ API timeout after 5 seconds');
      setIsLoading(false);
      setLaporanList([]);
    }, 5000);
    
    try {
      console.log('🔄 Fetching laporan from backend...');
      console.log('📍 API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
      
      const response = await getAdminLaporanList({
        limit: 10,
        page: 1,
      });

      clearTimeout(timeoutId); // Clear timeout if API responds
      console.log('📦 Laporan response:', response);

      // Backend returns flat structure: { success, message, data, statistics, pagination }
      if (response.success) {
        const data = response.data?.data || response.data || [];
        const statistics = response.data?.statistics || response.statistics;
        
        console.log('✅ Laporan loaded:', Array.isArray(data) ? data.length : 0, 'items');
        setLaporanList(Array.isArray(data) ? data : []);
        
        if (statistics) {
          setStats({
            total: statistics.total || 0,
            dalam_proses: statistics.dalam_proses || 0,
            verifikasi: statistics.verifikasi || 0,
            selesai: statistics.selesai || 0,
          });
          console.log('📊 Statistics:', statistics);
        }
      } else {
        console.error('❌ Failed to load laporan:', response.message);
        setLaporanList([]);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ Error loading laporan:', error);
      setLaporanList([]); // Set empty array on error
    } finally {
      setIsLoading(false);
      console.log('✅ Loading complete');
    }
  };

  const confirmLogout = () => {
    logout();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r-2 border-gray-200 p-6 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo dengan Icon */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-600">PPKPT</h2>
              <p className="text-xs text-gray-500">Polinela Admin</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm border-l-4 border-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </a>
          <a href="/admin/laporan" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Laporan
          </a>
          <a href="/admin/konten" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Konten
          </a>
          <a href="/admin/statistik" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistik
          </a>
          <a href="/admin/manajemen-pengguna" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manajemen Pengguna
          </a>
          <a href="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </a>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full transition text-sm mt-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content with margin for sidebar */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger Button */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >currentTime || "--:--:--"
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Waktu */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">Waktu Saat Ini : </span>
                <span className="text-blue-600 font-semibold" suppressHydrationWarning>
                  {currentTime || '--:--:--'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="/admin/notifikasi" className="p-2 hover:bg-gray-100 rounded-full transition relative">
                <svg 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
              </a>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm uppercase">{username}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 bg-gray-50">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              HALAMAN ADMIN
            </h1>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              PPKPT POLINELA
            </h2>
            <p className="text-gray-600">
              Keberanian Anda <span className="text-orange-500 font-semibold">Membuka Jalan</span> Perlindungan
            </p>
          </div>

          {/* Quick Access Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">AKSES CEPAT</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/admin/laporan"
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold">Verifikasi laporan baru</span>
                </div>
                <svg 
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </a>

              <a 
                href="/admin/statistik"
                className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-2xl shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold">Statistik</span>
                </div>
                <svg 
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">RINCIAN PESAN LAPORAN</h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                View all {laporanList.length}
              </button>
              <button
                onClick={() => setActiveTab("newest")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === "newest"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Terbaru {laporanList.length}
              </button>
              <button
                onClick={() => setActiveTab("oldest")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === "oldest"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Terlama 12
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat laporan...</p>
                </div>
              ) : laporanList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada laporan</p>
                </div>
              ) : (
                laporanList.slice(0, 5).map((laporan) => {
                  const tanggal = new Date(laporan.created_at);
                  const daysAgo = Math.floor((Date.now() - tanggal.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div
                      key={laporan.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg 
                            className="w-6 h-6 text-gray-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="font-semibold text-gray-800">{laporan.nama}</h5>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{daysAgo} hari yang lalu</span>
                              {daysAgo <= 1 && (
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{laporan.jenis_kekerasan}</p>
                          <p className="text-sm text-gray-700 mb-3">{laporan.domisili}</p>
                          <span className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                            laporan.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                            laporan.status === 'Dalam Proses' ? 'bg-gray-100 text-gray-700' :
                            laporan.status === 'Verifikasi' ? 'bg-orange-100 text-orange-600' :
                            laporan.status === 'Proses Tindak Lanjut' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {laporan.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-30">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center text-blue-600 flex-1"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs font-medium">Menu</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-400 flex-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Laporan</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-400 flex-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Statistik</span>
          </button>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center justify-center text-gray-400 flex-1"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h3>
              <p className="text-gray-600 mb-6">Anda akan keluar dari akun. Apakah Anda yakin ingin melanjutkan?</p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
