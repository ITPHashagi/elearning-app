"use client";
import Link from "next/link";
import React, { useState } from "react";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo và tên */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="./logo_image.jpg"
            className="h-10 w-10 rounded-full object-cover"
            alt="IT Learning Logo"
          />
          <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            IT Learning
          </span>
        </Link>

        {/* Thanh tìm kiếm và danh mục */}
        <div className="flex-1 flex items-center justify-start space-x-4 mx-6">
          <div className="relative group">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
              onClick={toggleDropdown}
            >
              <span className="text-lg">☰</span>
              <span className="text-sm font-medium">Danh mục khóa học</span>
            </button>
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 visible  transition-opacity duration-200 z-50">
                <ul className="py-2 text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/python"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Python
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      C++
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Front-end
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Back-end
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full max-w-2xl px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Nút Login */}
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            type="button"
            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 transition duration-200"
          >
            Đăng nhập
          </Link>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 transition duration-200"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
