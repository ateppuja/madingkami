'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Upload, ShieldCheck, UserCheck, BookOpen, Menu, X, Leaf, Sparkles } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('siswa');

  useEffect(() => {
    const savedRole = localStorage.getItem('mading_user_role') as UserRole;
    if (savedRole) setActiveRole(savedRole);
  }, []);

  const toggleRole = () => {
    const newRole: UserRole = activeRole === 'siswa' ? 'admin' : 'siswa';
    setActiveRole(newRole);
    localStorage.setItem('mading_user_role', newRole);
    window.dispatchEvent(new Event('mading_role_changed'));
  };

  const navLinks = [
    { href: '/', label: 'Dashboard Mading', icon: Leaf },
    { href: '/upload', label: 'Upload Karya', icon: Upload },
    { href: '/siswa/dashboard', label: 'Portofolio Saya', icon: BookOpen },
    { href: '/admin', label: 'Pengaturan Moderasi', icon: ShieldCheck, badge: activeRole === 'admin' ? 'Admin' : null },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2ebd5] text-[#1e2b20] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* WhiteBee Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/logo.png"
                alt="WhiteBee School Of Life Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-[#659f1d] tracking-tight">WhiteBee</span>
                <span className="text-xs font-bold text-slate-700 bg-[#eef5e4] px-2 py-0.5 rounded-full border border-[#d6e7bf]">
                  School Of Life
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                Mading Online Karya Siswa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#eef5e4] text-[#548716] border border-[#d2e4b8] shadow-sm'
                      : 'text-slate-600 hover:text-[#548716] hover:bg-[#f4f8ee]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#659f1d]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-2 py-0.5 text-[10px] bg-[#659f1d] text-white rounded-full font-extrabold uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Role Switcher & Live Status Pill */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f6e6] border border-[#d6e7bf] text-xs font-semibold text-[#548716]">
              <span className="w-2 h-2 rounded-full bg-[#659f1d] animate-pulse"></span>
              <span>Live Mading</span>
            </div>

            {/* Role Switcher Button */}
            <button
              onClick={toggleRole}
              title="Klik untuk memilih mode peran pengguna"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm ${
                activeRole === 'admin'
                  ? 'bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-[#659f1d]/10 text-[#548716] border-[#659f1d]/30 hover:bg-[#659f1d]/20'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{activeRole === 'admin' ? '🔑 Mode Admin' : '🎓 Mode Siswa'}</span>
              <span className="text-[10px] underline opacity-75">Ganti</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleRole}
              className="px-3 py-1 text-xs rounded-full bg-[#eef5e4] text-[#548716] font-bold border border-[#d2e4b8]"
            >
              {activeRole === 'admin' ? 'Admin' : 'Siswa'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-[#548716] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2ebd5] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-[#eef5e4] text-[#548716]' : 'text-slate-700 hover:bg-[#f4f8ee]'
                }`}
              >
                <Icon className="w-5 h-5 text-[#659f1d]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
