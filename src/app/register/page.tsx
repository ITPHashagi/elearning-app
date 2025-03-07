"use client";
import { api } from "@/server/api/apiCourse";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Register() {
  const [userRegister, setUserRegister] = useState({
    taiKhoan: "string",
    matKhau: "string",
    hoTen: "string",
    soDT: "string",
    maLoaiNguoiDung: "HV",
    maNhom: "GP01",
    email: "string",
  });

  const router = useRouter();

  const [message, setMessage] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result = await api.post("/QuanLyNguoiDung/DangKy", userRegister);
      setMessage("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");

      // chuyển hướng trang
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMessage("Đăng ký thất bại! ");
    }
  };

  return (
    <div className="max-w-4xl max-sm:max-w-lg mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-12 sm:mb-16">
        <a href="javascript:void(0)">
          <img
            src="./logo-footer.png"
            alt="logo"
            className="w-64 inline-block"
          />
        </a>
        <h4 className="text-gray-600 text-base mt-6">
          Sign up into your account
        </h4>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-sm mb-2 block">Fullname</label>
            <input
              name="hoTen"
              type="text"
              onChange={(e) => {
                setUserRegister({ ...userRegister, hoTen: e.target.value });
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your fullname"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-2 block">
              Tài khoản
            </label>
            <input
              name="taiKhoan"
              type="text"
              onChange={(e) => {
                setUserRegister({ ...userRegister, taiKhoan: e.target.value });
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-2 block">Email</label>
            <input
              name="email"
              type="text"
              onChange={(e) => {
                setUserRegister({ ...userRegister, email: e.target.value });
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-2 block">
              Số điện thoại
            </label>
            <input
              name="soDT"
              type="number"
              onChange={(e) => {
                setUserRegister({ ...userRegister, soDT: e.target.value });
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm mb-2 block">Password</label>
            <input
              name="matKhau"
              type="password"
              onChange={(e) => {
                setUserRegister({ ...userRegister, matKhau: e.target.value });
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter password"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Sign up
          </button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Register;
