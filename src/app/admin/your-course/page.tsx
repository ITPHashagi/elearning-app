"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Modal, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getCourses,
  CourseData,
  postGhiDanhKhoaHoc,
} from "@/server/api/course";
import {
  postDanhSachHocVienKhoaHoc,
  postHocVienChoXetDuyet,
} from "@/server/api/user";

interface ExtendedCourse extends CourseData {
  soLuongHocVien?: number;
  soLuongChoDuyet?: number;
}

const AdminCoursesPage: React.FC = () => {
  const [myCourses, setMyCourses] = useState<ExtendedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourse | null>(
    null
  );
  const [waitingStudents, setWaitingStudents] = useState<string[]>([]);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("adminInfo") || "{}")?.taiKhoan || ""
      : "";

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      const allCourses: CourseData[] = response.data;

      const filtered = allCourses.filter(
        (course) => course.nguoiTao?.taiKhoan === currentUser
      );

      const extended: ExtendedCourse[] = [];
      for (const course of filtered) {
        const maKhoaHoc = course.maKhoaHoc;

        const hvRes = await postDanhSachHocVienKhoaHoc(maKhoaHoc);
        const dsHocVien = hvRes.data;
        const soHocVien = Array.isArray(dsHocVien) ? dsHocVien.length : 0;

        const waitingRes = await postHocVienChoXetDuyet(maKhoaHoc);
        const dsChoDuyet = waitingRes.data;
        const soChoDuyet = Array.isArray(dsChoDuyet) ? dsChoDuyet.length : 0;

        extended.push({
          ...course,
          soLuongHocVien: soHocVien,
          soLuongChoDuyet: soChoDuyet,
        });
      }
      setMyCourses(extended);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Lỗi khi tải danh sách khoá học");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("CurrentUser:", currentUser);
    if (currentUser) {
      fetchMyCourses();
    }
  }, [currentUser, fetchMyCourses]);

  const columns: ColumnsType<ExtendedCourse> = [
    {
      title: "Mã khoá học",
      dataIndex: "maKhoaHoc",
      key: "maKhoaHoc",
    },
    {
      title: "Tên khoá học",
      dataIndex: "tenKhoaHoc",
      key: "tenKhoaHoc",
    },
    {
      title: "Số học viên",
      dataIndex: "soLuongHocVien",
      key: "soLuongHocVien",
      render: (value) => value || 0,
    },
    {
      title: "Chờ duyệt",
      dataIndex: "soLuongChoDuyet",
      key: "soLuongChoDuyet",
      render: (value) => value || 0,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleShowWaitingStudents(record)}
            disabled={!record.soLuongChoDuyet}
          >
            Duyệt HV
          </Button>
        </Space>
      ),
    },
  ];

  const handleShowWaitingStudents = async (course: ExtendedCourse) => {
    try {
      setSelectedCourse(course);
      setLoading(true);
      const waitingRes = await postHocVienChoXetDuyet(course.maKhoaHoc);
      const dsChoDuyet = waitingRes.data || [];
      setWaitingStudents(dsChoDuyet.map((item: any) => item.taiKhoan));
    } catch (error) {
      console.error("Error fetching waiting students:", error);
      message.error("Lỗi khi tải danh sách học viên chờ duyệt");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (taiKhoanHV: string) => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      await postGhiDanhKhoaHoc({
        maKhoaHoc: selectedCourse.maKhoaHoc,
        taiKhoan: taiKhoanHV,
      });
      message.success(`Đã duyệt cho học viên ${taiKhoanHV}`);
      setWaitingStudents((prev) => prev.filter((tk) => tk !== taiKhoanHV));
    } catch (error) {
      console.error("Error approving student:", error);
      message.error("Duyệt học viên thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Quản lý khoá học của bạn (tài khoản: {currentUser})
      </h1>
      <Table
        rowKey="maKhoaHoc"
        dataSource={myCourses}
        columns={columns}
        loading={loading}
      />

      <Modal
        title={`Duyệt học viên cho khoá ${
          selectedCourse?.tenKhoaHoc || selectedCourse?.maKhoaHoc || ""
        }`}
        open={!!selectedCourse}
        onCancel={() => setSelectedCourse(null)}
        footer={null}
      >
        {loading ? (
          <p>Đang tải...</p>
        ) : waitingStudents.length > 0 ? (
          waitingStudents.map((hv) => (
            <div
              key={hv}
              className="flex items-center justify-between border-b py-2"
            >
              <span>{hv}</span>
              <Button type="primary" onClick={() => handleApproveStudent(hv)}>
                Duyệt
              </Button>
            </div>
          ))
        ) : (
          <p>Không có học viên chờ duyệt.</p>
        )}
      </Modal>
    </div>
  );
};

export default AdminCoursesPage;
