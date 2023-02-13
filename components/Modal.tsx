import styles from "@/styles/Home.module.css";
import { TypeBlog } from "@/type/type";
import { Input, Modal, DatePicker, Form } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import moment from "moment";

type Props = {
  dataLength: number;
  showModal: boolean;
  editData?: TypeBlog;
  setOpen: (value: boolean) => void;
  createBlog: (value: TypeBlog) => void;
};

export default function ModalsForm({
  showModal,
  setOpen,
  createBlog,
  editData,
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

  const handleDateChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    setDataBlog({ ...dataBlog, createdAt: dateStrings.toString() });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //validate and click ok event
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      createBlog(dataBlog);
      setOpen(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  useEffect(() => {
    if (editData) {
      let { id, title, content, createdBy, createdAt } = editData;
      setDataBlog({
        id: id,
        title: title,
        content: content,
        createdBy: createdBy,
        createdAt: createdAt,
      });
    } else {
      setDataBlog({...dataBlog, id: dataLength + 1})
    }
  }, [showModal]);

  return (
    <Modal
      title='Create Blog'
      open={showModal}
      onOk={onCheck}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} name='dynamic_rule' style={{ maxWidth: 600 }}>
        <Input
          onChange={handdleChange}
          name='id'
          placeholder='ID'
          value={dataBlog.id}
          disabled
        />
        <Form.Item
          name='title'
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input
            onChange={handdleChange}
            name='title'
            placeholder='Title'
            value={dataBlog.title}
          />
        </Form.Item>
        <Form.Item
          name='content'
          rules={[{ required: true, message: "Please input content" }]}
        >
          <Input
            onChange={handdleChange}
            value={dataBlog.content}
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
            value={dataBlog.createdBy}
            placeholder='Created By'
          />
        </Form.Item>
        <Form.Item
          name='createdAt'
          rules={[{ required: true, message: "Please input date" }]}
        >
          <DatePicker
            value={null}
            onChange={handleDateChange}
            placeholder='Created At'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
