"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Modal, Tabs, Table, Button } from "antd";
import { toast } from "react-toastify";
import {
  postNguoiDungChuaGhiDanhKhoaHoc,
  postDanhSachHocVienKhoaHoc,
  postHocVienChoXetDuyet,
} from "@/server/api/user";
import { postGhiDanhKhoaHoc, postHuyGhiDanh } from "@/server/api/course";
import "react-toastify/dist/ReactToastify.css";

interface UserEnrollmentModalProps {
  visible: boolean;
  maKhoaHoc: string;
  onCancel: () => void;
}

interface UserData {
  taiKhoan: string;
  matKhau: string;
  biDanh: string;
}

const UserEnrollmentModal: React.FC<UserEnrollmentModalProps> = ({
  visible,
  maKhoaHoc,
  onCancel,
}) => {
  const [notEnrolledUsers, setNotEnrolledUsers] = useState<UserData[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [notEnrolledRes, enrolledRes, pendingRes] = await Promise.all([
        postNguoiDungChuaGhiDanhKhoaHoc(maKhoaHoc),
        postDanhSachHocVienKhoaHoc(maKhoaHoc),
        postHocVienChoXetDuyet(maKhoaHoc),
      ]);
      setNotEnrolledUsers(notEnrolledRes.data);
      setEnrolledUsers(enrolledRes.data);
      setPendingUsers(pendingRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [maKhoaHoc]);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, fetchData]);

  const handleEnroll = async (user: UserData) => {
    try {
      await postGhiDanhKhoaHoc({ maKhoaHoc, taiKhoan: user.taiKhoan });
      toast.success("Ghi danh thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Ghi danh thất bại");
    }
  };

  const handleCancelEnrollment = async (user: UserData) => {
    try {
      await postHuyGhiDanh({ maKhoaHoc, taiKhoan: user.taiKhoan });
      toast.success("Hủy ghi danh thành công");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Hủy ghi danh thất bại");
    }
  };

  const generateColumns = (type: "notEnrolled" | "enrolled" | "pending") => {
    const baseColumns = [
      { title: "Tài khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
      { title: "Bí danh", dataIndex: "biDanh", key: "biDanh" },
    ];

    let actionColumn;
    if (type === "notEnrolled") {
      actionColumn = {
        title: "Hành động",
        key: "action",
        render: (_: any, record: UserData) => (
          <Button type="primary" onClick={() => handleEnroll(record)}>
            Ghi danh
          </Button>
        ),
      };
    } else if (type === "enrolled") {
      actionColumn = {
        title: "Hành động",
        key: "action",
        render: (_: any, record: UserData) => (
          <Button danger onClick={() => handleCancelEnrollment(record)}>
            Hủy ghi danh
          </Button>
        ),
      };
    } else {
      actionColumn = {
        title: "Hành động",
        key: "action",
        render: (_: any, record: UserData) => (
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
      };
    }

    return [...baseColumns, actionColumn];
  };

  const tabItems = [
    {
      key: "1",
      label: "Chưa ghi danh",
      children: (
        <Table
          dataSource={notEnrolledUsers}
          columns={generateColumns("notEnrolled")}
          loading={loading}
          rowKey="taiKhoan"
        />
      ),
    },
    {
      key: "2",
      label: "Đã ghi danh",
      children: (
        <Table
          dataSource={enrolledUsers}
          columns={generateColumns("enrolled")}
          loading={loading}
          rowKey="taiKhoan"
        />
      ),
    },
    {
      key: "3",
      label: "Chờ xét duyệt",
      children: (
        <Table
          dataSource={pendingUsers}
          columns={generateColumns("pending")}
          loading={loading}
          rowKey="taiKhoan"
        />
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      title={`Quản lý ghi danh cho khóa học: ${maKhoaHoc}`}
    >
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Modal>
  );
};

export default UserEnrollmentModal;
