"use client";
import React from "react";
import { Table, Tag, Space, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "@/types/user";
import { formatText } from "@/app/utils/format";

interface UserTableProps {
  users: User[];
  loading: boolean; 
  onDelete: (taiKhoan: string) => void;
  onEdit: (taiKhoan: string) => void;
}

// Constants
const EMPTY_TEXT = "Không có thông tin";
const EMPTY_EMAIL = "Chưa có email";
const EMPTY_PHONE = "Chưa có số điện thoại";
const EMPTY_ROLE = "Không xác định";

export default function UserTable({
  users,
  loading,
  onDelete,
  onEdit,
}: UserTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      render: (text) => formatText(text, EMPTY_TEXT),
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      render: (text) => formatText(text, EMPTY_TEXT),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) =>
        text ? (
          text
        ) : (
          <Tooltip title="Email chưa được cung cấp">
            <span style={{ color: "#999" }}>
              <ExclamationCircleOutlined /> {EMPTY_EMAIL}
            </span>
          </Tooltip>
        ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDt",
      key: "soDt",
      render: (text) =>
        text ? (
          text
        ) : (
          <Tooltip title="Số điện thoại chưa được cung cấp">
            <span style={{ color: "#999" }}>
              <ExclamationCircleOutlined /> {EMPTY_PHONE}
            </span>
          </Tooltip>
        ),
    },
    {
      title: "Loại người dùng",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      render: (text: string) =>
        text ? (
          <Tag color={text === "GV" ? "geekblue" : "green"}>{text}</Tag>
        ) : (
          <Tag color="default">{EMPTY_ROLE}</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_text, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#fa8c16", fontSize: 18 }} />}
            onClick={() => onEdit(record.taiKhoan)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "#f5222d", fontSize: 18 }} />}
            onClick={() => onDelete(record.taiKhoan)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="taiKhoan"
    />
  );
}
