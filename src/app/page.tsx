"use client";
import { useState, useEffect } from "react";
import api from "./api";
import Image from "next/image";
import CourseCard from "./CourseCard";

type CourseList = {
  maKhoaHoc: number | string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: string;
  hinhAnh: string | null | undefined;
  maNhom: "gp01";
  ngayTao: string;
  soLuongHocVien: number;
  nguoiTao: {
    taiKhoan: null;
    hoTen: null;
    maLoaiNguoiDung: null;
    tenLoaiNguoiDung: null;
  };
  danhMucKhoaHoc: {
    maDanhMucKhoahoc: string;
    tenDanhMucKhoaHoc: string;
  };
};

export default function Home() {
  const [course, setCourse] = useState<CourseList[]>([]);

  const fetchCourse = async () => {
    try {
      const result = await api.get(
        "/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01"
      );
      setCourse(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);
  return (
    <div>
      <div className="Carousel">
        <h1>Carousel</h1>
      </div>
      <h1 className="text-2xl font-bold my-4">Các khóa học mới nhất</h1>
      <div className="container mx-auto grid grid-cols-4 gap-4">
        {course.map((courses) => (
          <CourseCard key={courses.maKhoaHoc} course={courses} />
        ))}
      </div>
    </div>
  );
}
