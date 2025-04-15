"use client";
import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Upload,
  Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateCourse, uploadCourseImage } from "@/server/api/course";
import { toast } from "react-toastify";
import type { CourseList } from "@/types/courseList";
import moment from "moment";

// Danh sách mã danh mục khóa học
const validCourseCategories = [
  { value: "BackEnd", label: "Lập trình Backend" },
  { value: "Design", label: "Thiết kế Web" },
  { value: "DiDong", label: "Lập trình di động" },
  { value: "FrontEnd", label: "Lập trình Front end" },
  { value: "FullStack", label: "Lập trình Full Stack" },
  { value: "TuDuy", label: "Tư duy lập trình" },
];

interface EditCourseModalProps {
  visible: boolean;
  course?: CourseList | null;
  onCancel: () => void;
  onUpdated: () => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  visible,
  course,
  onCancel,
  onUpdated,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (course) {
      console.log("Course nhận được:", course);

  
      const maDanhMuc =
        course.danhMucKhoaHoc.maDanhMucKhoahoc ||
        (course.danhMucKhoaHoc && course.danhMucKhoaHoc.maDanhMuc
          ? course.danhMucKhoaHoc.maDanhMuc
          : "BackEnd");

      form.setFieldsValue({
        maKhoaHoc: course.maKhoaHoc,
        biDanh: course.biDanh,
        tenKhoaHoc: course.tenKhoaHoc,
        moTa: course.moTa,
        luotXem: course.luotXem,
        danhGia: course.danhGia !== undefined ? Number(course.danhGia) : 0,
        maNhom: course.maNhom,
        ngayTao: course.ngayTao ? moment(course.ngayTao, "DD/MM/YYYY") : null,
        maDanhMucKhoaHoc: maDanhMuc,
        taiKhoanNguoiTao: course?.nguoiTao?.taiKhoan || "",
      });

      form.setFieldValue(
        "hinhAnh",
        course.hinhAnh
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: course.hinhAnh,
              },
            ]
          : []
      );
    }
  }, [course, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.ngayTao) {
        values.ngayTao = values.ngayTao.format("DD/MM/YYYY");
      }

      let hinhAnhValue = "";
      if (
        values.hinhAnh &&
        Array.isArray(values.hinhAnh) &&
        values.hinhAnh.length > 0 &&
        values.hinhAnh[0].originFileObj
      ) {
        const uploadResponse = await uploadCourseImage(
          values.hinhAnh[0].originFileObj,
          values.tenKhoaHoc
        );
        hinhAnhValue = uploadResponse.data;
      } else if (course && course.hinhAnh) {
        hinhAnhValue = course.hinhAnh;
      }

      const payload = {
        maKhoaHoc: values.maKhoaHoc,
        biDanh: values.biDanh,
        tenKhoaHoc: values.tenKhoaHoc,
        moTa: values.moTa,
        luotXem: values.luotXem,
        danhGia: values.danhGia,
        hinhAnh: hinhAnhValue,
        maNhom: values.maNhom,
        ngayTao: values.ngayTao,
        maDanhMucKhoaHoc: values.maDanhMucKhoaHoc,
        taiKhoanNguoiTao: values.taiKhoanNguoiTao,
      };

      await updateCourse(payload);
      toast.success("Cập nhật khóa học thành công!");
      onUpdated();
      onCancel();
    } catch (error) {
      toast.error("Cập nhật khóa học thất bại!");
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa khóa học"
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
        okText="Cập nhật"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maKhoaHoc"
            label="Mã khóa học"
            rules={[{ required: true, message: "Vui lòng nhập mã khóa học" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="biDanh"
            label="Bí danh"
            rules={[{ required: true, message: "Vui lòng nhập bí danh" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tenKhoaHoc"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="luotXem"
            label="Lượt xem"
            rules={[{ required: true, message: "Vui lòng nhập lượt xem" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="danhGia"
            label="Đánh giá"
            rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}
          >
            <InputNumber min={0} max={5} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="hinhAnh"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
            valuePropName="fileList"
            getValueFromEvent={(e: any) =>
              Array.isArray(e) ? e : e && e.fileList
            }
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="maNhom"
            label="Mã nhóm"
            rules={[{ required: true, message: "Vui lòng nhập mã nhóm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngayTao"
            label="Ngày tạo"
            rules={[{ required: true, message: "Vui lòng chọn ngày tạo" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maDanhMucKhoaHoc"
            label="Mã danh mục khóa học"
            rules={[
              { required: true, message: "Vui lòng chọn danh mục khóa học" },
            ]}
          >
            <Select options={validCourseCategories} />
          </Form.Item>
          <Form.Item
            name="taiKhoanNguoiTao"
            label="Tài khoản người tạo"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản người tạo" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-input,
        .ant-input-affix-wrapper,
        .ant-select-selector,
        .ant-picker,
        .ant-input-number,
        .ant-input-number-input,
        .ant-upload,
        .ant-picker-input > input {
          border-radius: 6px !important;
        }
        .ant-input::placeholder,
        .ant-select-selection-placeholder,
        .ant-picker-input > input::placeholder {
          color: #a0aec0 !important;
        }
      `}</style>
    </>
  );
};

export default EditCourseModal;
