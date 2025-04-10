"use client";
import { api } from "@/server/api/api";
import { UserInfo } from "@/types/userInfo";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserInfo>({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    maLoaiNguoiDung: "HV",
    soDT: "",
    maNhom: "GP01",
    email: "",
  });
  const [registeredCourses, setRegisteredCourses] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataInfo = localStorage.getItem("userInfo");
      if (userDataInfo) {
        try {
          const parsedData = JSON.parse(userDataInfo);
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));

          // Lấy danh sách khóa học đã đăng ký theo tài khoản
          const payments = localStorage.getItem(
            `thanhToan_${parsedData.taiKhoan}`
          );
          const courses = payments ? JSON.parse(payments) : [];
          setRegisteredCourses(courses);
        } catch (error: any) {
          localStorage.removeItem("userInfo");
        }
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const hashedPassword = CryptoJS.AES.encrypt(
        formData.matKhau,
        "secret_key"
      ).toString();
      const result = await api.put(
        "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        formData
      );
      if (result.data) {
        alert("Cập nhật thành công!");
        const userInfo = { ...formData, matKhau: hashedPassword };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        router.push("/");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.log("Lỗi cập nhật");
      alert("Có lỗi xảy ra vui lòng thử lại");
    }
  };

  const handleUnregister = (maKhoaHoc: string | number) => {
    if (typeof window !== "undefined") {
      try {
        // Lọc danh sách khóa học để loại bỏ khóa học có maKhoaHoc tương ứng
        const updatedCourses = registeredCourses.filter(
          (course) => course.maKhoaHoc !== maKhoaHoc
        );
        setRegisteredCourses(updatedCourses);

        // Cập nhật lại localStorage
        localStorage.setItem(
          `thanhToan_${formData.taiKhoan}`,
          JSON.stringify(updatedCourses)
        );
        alert("Hủy khóa học thành công");
      } catch (error) {
        console.error("Lỗi hủy đăng ký:", error);
        alert("Có lỗi xảy ra khi hủy khóa học");
      }
    }
  };

  return (
    <div className="max-w-full">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-xl font-bold mb-4">
          Thông tin tài khoản: <span>{formData.taiKhoan}</span>
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Họ tên</label>
          <input
            type="text"
            name="hoTen"
            value={formData.hoTen}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="soDT"
            value={formData.soDT}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          className="w-full p-2 bg-blue-500 text-white rounded-lg"
          onClick={handleUpdate}
        >
          Cập nhật
        </button>
      </div>
      <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-md mt-5">
        <h2 className="text-xl font-bold mb-4">Khóa học đã đăng ký</h2>
        {registeredCourses.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">STT</th>
                <th className="border p-2">Tên khóa học</th>
                <th className="border p-2">Số lượng</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.map((course, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{course.tenKhoaHoc}</td>
                  <td className="border p-2">{course.count || 1}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleUnregister(course.maKhoaHoc)}
                      className="p-1 bg-red-500 text-white rounded-lg"
                    >
                      Hủy ghi danh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có khóa học nào được đăng ký.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
