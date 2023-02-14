import { ChangeEvent, useEffect, useState } from "react";
import { DatePicker, Form, Input, Modal } from "antd";

import type { Dayjs } from "dayjs";
import { TypeBlog } from "@/type/type";
import dayjs from "dayjs";
import moment from "moment";
import styles from "@/styles/Home.module.css";

type Props = {
  dataLength: number;
  showModal: boolean;
  editData?: TypeBlog;
  setOpen: (value: boolean) => void;
  createBlog: (value: TypeBlog) => void;
  updateBlog: (value: TypeBlog) => void;
};

export default function ModalsForm({
  showModal,
  setOpen,
  createBlog,
  editData,
  updateBlog,
  dataLength
}: Props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const [dataBlog, setDataBlog] = useState<TypeBlog>({
    id: 0,
    title: "",
    content: "",
    createdBy: "",
    createdAt: "",
  });

  const handdleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { value, name } = e.target;
    setDataBlog({ ...dataBlog, [name]: value });
  };

  const handleDateChange = (value: Dayjs | null, dateString: string) => {
    setDataBlog({ ...dataBlog, createdAt: dateString.toString() });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //validate and click ok event
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      if(editData?.title == "") {
        createBlog(dataBlog);
      } else {
        updateBlog(dataBlog);
      }
      setOpen(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const convertData = (data?: TypeBlog) => {
    if (data?.title !== "") {
      return { ...data, createdAt: moment(data?.createdAt, 'YYYY-MM-DD') }
    }
    return data
  }

  useEffect(() => {
    form.setFieldsValue(convertData(editData))
    if(editData) setDataBlog(editData)
   }, [form, editData])

  return (
    <Modal
      title={editData?.title == "" ? 'Create Blog' : 'Edit Blog'}
      open={showModal}
      onOk={onCheck}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} name='dynamic_rule' style={{ maxWidth: 600 }} initialValues={convertData(editData)}>
        <Form.Item name='id'>
          <Input
            onChange={handdleChange}
            name='id'
            placeholder='ID'
            disabled
          />
        </Form.Item>
        <Form.Item
          name='title'
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input
            onChange={handdleChange}
            name='title'
            placeholder='Title'
          />
        </Form.Item>
        <Form.Item
          name='content'
          rules={[{ required: true, message: "Please input content" }]}
        >
          <Input
            onChange={handdleChange}
            name='content'
            placeholder='Blog Content'
          />
        </Form.Item>
        <Form.Item
          name='createdBy'
          rules={[{ required: true, message: "Please input created by" }]}
        >
          <Input
            onChange={handdleChange}
            name='createdBy'
            placeholder='Created By'
          />
        </Form.Item>
        <Form.Item
          name='createdAt'
          rules={[{ required: true, message: "Please input date" }]}
        >
          <DatePicker
            onChange={handleDateChange}
            placeholder='Created At'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
