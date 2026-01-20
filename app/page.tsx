"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await login(username, password);
      
      console.log('Login response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      
      if (response.success === true && response.data) {
        console.log('User role:', response.data.user?.role);
        
        // Check if user is admin or superadmin
        const userRole = response.data.user?.role;
        if (userRole === 'admin' || userRole === 'superadmin') {
          // Store additional data for UI
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("full_name", response.data.user.full_name);
          localStorage.setItem("role", response.data.user.role);
          
          console.log('✅ Login success! Redirecting to admin...');
          
          // Force redirect with window.location
          setTimeout(() => {
            window.location.href = "/admin";
          }, 100);
          return; // Stop execution here
        } else {
          console.log('❌ User role not admin:', userRole);
          setError("Hanya admin yang dapat mengakses halaman ini");
        }
      } else {
        // Handle error messages from backend
        console.log('❌ Login failed:', response.message);
        setError(response.message || "Username atau password salah");
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src="/media/logo-polinela.png"
                alt="Logo Polinela"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-2">
            Aplikasi PPKPT POLINELA
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Masukan username dan password yang benar
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">
                EMAIL ATAU USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                placeholder="Masukan email atau username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  PASSWORD
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                  placeholder="············"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <svg 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                      />
                    </svg>
                  ) : (
                    <svg 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold transition-colors duration-200 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
