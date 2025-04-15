"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Modal, Tabs, Table, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getCourses,
  postGhiDanhKhoaHoc,
  postHuyGhiDanh,
} from "@/server/api/course";
import {
  postLayDanhSachKhoaHocDaXetDuyet,
  postKhoaHocChoXetDuyet,
} from "@/server/api/user";
import { CourseData } from "@/server/api/course";

interface GhiDanhModalProps {
  visible: boolean;
  taiKhoan: string;
  onClose: () => void;
}

const GhiDanhModal: React.FC<GhiDanhModalProps> = ({
  visible,
  taiKhoan,
  onClose,
}) => {
  const [notEnrolledCourses, setNotEnrolledCourses] = useState<CourseData[]>(
    []
  );
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [pendingCourses, setPendingCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const coursesRes = await getCourses();
      const enrolledRes = await postLayDanhSachKhoaHocDaXetDuyet(taiKhoan);
      const pendingRes = await postKhoaHocChoXetDuyet(taiKhoan);

      const enrolledCodes = new Set(
        (enrolledRes.data as CourseData[]).map((course) => course.maKhoaHoc)
      );
      const pendingCodes = new Set(
        (pendingRes.data as CourseData[]).map((course) => course.maKhoaHoc)
      );
      const notEnrolled = (coursesRes.data as CourseData[]).filter(
        (course) =>
          !enrolledCodes.has(course.maKhoaHoc) &&
          !pendingCodes.has(course.maKhoaHoc)
      );

      setNotEnrolledCourses(notEnrolled);
      setEnrolledCourses(enrolledRes.data);
      setPendingCourses(pendingRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  }, [taiKhoan]);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, fetchData]);

  const handleEnroll = async (course: CourseData) => {
    try {
      await postGhiDanhKhoaHoc({ maKhoaHoc: course.maKhoaHoc, taiKhoan });
      toast.success("Ghi danh thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Ghi danh thất bại");
    }
  };

  const handleCancelEnrollment = async (course: CourseData) => {
    try {
      await postHuyGhiDanh({ maKhoaHoc: course.maKhoaHoc, taiKhoan });
      toast.success("Hủy ghi danh thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Hủy ghi danh thất bại");
    }
  };

  const columnsNotEnrolled = [
    { title: "Mã khóa học", dataIndex: "maKhoaHoc", key: "maKhoaHoc" },
    { title: "Tên khóa học", dataIndex: "tenKhoaHoc", key: "tenKhoaHoc" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: CourseData) => (
        <Button type="primary" onClick={() => handleEnroll(record)}>
          Ghi danh
        </Button>
      ),
    },
  ];

  const columnsEnrolled = [
    { title: "Mã khóa học", dataIndex: "maKhoaHoc", key: "maKhoaHoc" },
    { title: "Tên khóa học", dataIndex: "tenKhoaHoc", key: "tenKhoaHoc" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: CourseData) => (
        <Button danger onClick={() => handleCancelEnrollment(record)}>
          Hủy ghi danh
        </Button>
      ),
    },
  ];

  const columnsPending = [
    { title: "Mã khóa học", dataIndex: "maKhoaHoc", key: "maKhoaHoc" },
    { title: "Tên khóa học", dataIndex: "tenKhoaHoc", key: "tenKhoaHoc" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: CourseData) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEnroll(record)}
            style={{ marginRight: 8 }}
          >
            Xác thực
          </Button>
          <Button danger onClick={() => handleCancelEnrollment(record)}>
            Hủy
          </Button>
        </>
      ),
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Chưa ghi danh",
      children: (
        <Table
          dataSource={notEnrolledCourses}
          columns={columnsNotEnrolled}
          loading={loading}
          rowKey="maKhoaHoc"
        />
      ),
    },
    {
      key: "2",
      label: "Đã ghi danh",
      children: (
        <Table
          dataSource={enrolledCourses}
          columns={columnsEnrolled}
          loading={loading}
          rowKey="maKhoaHoc"
        />
      ),
    },
    {
      key: "3",
      label: "Chờ xét duyệt",
      children: (
        <Table
          dataSource={pendingCourses}
          columns={columnsPending}
          loading={loading}
          rowKey="maKhoaHoc"
        />
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={`Quản lý ghi danh cho người dùng: ${taiKhoan}`}
    >
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Modal>
  );
};

export default GhiDanhModal;
