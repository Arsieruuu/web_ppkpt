"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadKontenPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Form states
  const [judulKonten, setJudulKonten] = useState("");
  const [deskripsiKonten, setDeskripsiKonten] = useState("");
  const [kategori, setKategori] = useState("Edukasi");
  const [subKategori, setSubKategori] = useState("Anti-Kekerasan");
  const [showSubKategoriDropdown, setShowSubKategoriDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setUsername(storedUsername || "Admin");
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSubKategoriDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.sub-kategori-dropdown')) {
          setShowSubKategoriDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSubKategoriDropdown]);

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    // Handle upload logic here
    console.log({
      judulKonten,
      deskripsiKonten,
      kategori,
      subKategori,
      selectedImage
    });
    // After upload, redirect back to konten page
    // router.push("/admin/konten");
  };

  const subKategoriOptions = {
    Edukasi: ["Anti-Kekerasan", "Kesehatan Mental", "Hukum dan HAM", "Pengembangan Diri"],
    Kegiatan: ["Seminar", "Workshop", "Kampanye", "Pelatihan"]
  };

  return (
    <div className="min-h-screen bg-white">
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
              <h2 className="text-xl font-bold text-gray-800">PPKPT</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          
          {/* Close button untuk mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <a 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>

          <a 
            href="/admin/laporan" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Laporan</span>
          </a>

          <a 
            href="/admin/konten" 
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Konten</span>
          </a>

          <a 
            href="/admin/statistik" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="font-medium">Statistik</span>
          </a>

          <a 
            href="/admin/manajemen-pengguna" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-medium">Manajemen User</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Back button */}
              <button 
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Upload Konten Baru</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification */}
              <a 
                href="/admin/notifikasi"
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </a>

              {/* Profile */}
              <a 
                href="/admin/profile"
                className="hidden md:flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 pb-32 lg:pb-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            
            {/* Judul Konten */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Judul Konten<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={judulKonten}
                onChange={(e) => setJudulKonten(e.target.value)}
                placeholder="Masukkan judul konten..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Pilih Gambar */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Pilih Gambar<span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-blue-200 rounded-xl p-8 bg-blue-50">
                {imagePreview ? (
                  <div className="text-center">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                    <p className="text-gray-600 text-sm mb-2">{selectedImage?.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">Belum ada gambar dipilih</p>
                  </div>
                )}
                
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Unggah
                  </span>
                </label>
              </div>
            </div>

            {/* Deskripsi Konten */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Deskripsi Konten<span className="text-red-500">*</span>
              </label>
              <textarea
                value={deskripsiKonten}
                onChange={(e) => setDeskripsiKonten(e.target.value)}
                placeholder="Tambahkan deskripsi...."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Kategori Konten */}
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Kategori Konten<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setKategori("Edukasi");
                    setSubKategori("Anti-Kekerasan");
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 border-2 rounded-xl transition ${
                    kategori === "Edukasi"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    kategori === "Edukasi" ? "border-blue-500" : "border-gray-300"
                  }`}>
                    {kategori === "Edukasi" && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className={`font-medium ${kategori === "Edukasi" ? "text-blue-600" : "text-gray-700"}`}>
                    Edukasi
                  </span>
                </button>

                <button
                  onClick={() => {
                    setKategori("Kegiatan");
                    setSubKategori("Seminar");
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 border-2 rounded-xl transition ${
                    kategori === "Kegiatan"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    kategori === "Kegiatan" ? "border-blue-500" : "border-gray-300"
                  }`}>
                    {kategori === "Kegiatan" && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className={`font-medium ${kategori === "Kegiatan" ? "text-blue-600" : "text-gray-700"}`}>
                    Kegiatan
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-Kategori */}
            <div className="sub-kategori-dropdown">
              <label className="block text-gray-800 font-semibold mb-2">
                Sub-Kategori<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSubKategoriDropdown(!showSubKategoriDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 transition text-gray-800"
                >
                  <span>{subKategori}</span>
                  <svg className={`w-5 h-5 text-blue-600 transition-transform ${showSubKategoriDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showSubKategoriDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-60 overflow-y-auto">
                    {subKategoriOptions[kategori as keyof typeof subKategoriOptions].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSubKategori(option);
                          setShowSubKategoriDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-800"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Upload Content
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around items-center py-2">
          <a href="/admin" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">Home</span>
          </a>

          <a href="/admin/laporan" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Laporan</span>
          </a>

          <a href="/admin/konten" className="flex flex-col items-center gap-1 px-4 py-2 text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Konten</span>
          </a>

          <a href="/admin/statistik" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-xs">Statistik</span>
          </a>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
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
