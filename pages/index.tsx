import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Input, Table, notification } from "antd";
import { SearchType, TypeBlog } from "@/type/type";
import { ToastContainer, toast } from 'react-toastify';
import { debounce, isEmpty } from "lodash";

import Fuse from "fuse.js";
import Head from "next/head";
import ModalsForm from "@/components/Modal";
import { NewLineKind } from "typescript";
import moment from "moment";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [listBlogs, setListBlogs] = useState<TypeBlog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<TypeBlog>();

  const options = {
    isCaseSensitive: true,
    includeMatches: false,
    // Search in "title", "content","createdBy","createdAt"
    keys: ["title", "content", "createdBy", "createdAt"],
  };

  const toastNotification = (value: string) => {
    toast.success(value, {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  const fuse = new Fuse(listBlogs, options);

  //trigger modal
  const setOpenModal = (value: boolean) => {
    setShowModal(value);
  };

  //create blog
  const createBlog = (data: TypeBlog) => {
    let result = [];
    result.push(data);
    setListBlogs([...listBlogs, ...result]);
    localStorage.setItem("blogs", JSON.stringify(listBlogs.concat(result)));
    toastNotification("Create blog successfully!")
  };

  //update blog
  const updateBlog = (data: TypeBlog) => {
    let result = listBlogs.findIndex(item => item.id === data.id);
    listBlogs[result].title = data.title
    listBlogs[result].content = data.content
    listBlogs[result].createdBy = data.createdBy
    listBlogs[result].createdAt = data.createdAt
    setListBlogs(listBlogs)
    localStorage.setItem("blogs", JSON.stringify(listBlogs));
    toastNotification("Edit blog successfully!")
  };

  const debouncedSearch = debounce(async (criteria) => {
    if (!criteria) return;
    const result = fuse.search(criteria);
    convertListBlogs(result);
  }, 1000);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const convertListBlogs = (result: SearchType[]) => {
    let list = result.map((data, index) => {
      return data.item;
    });
    setListBlogs(list);
  };

  const newId = (arr: TypeBlog[]) => {
    if(isEmpty(arr)) return 1
    const max = Math.max(...arr.map(item => {
      return item.id;
    }));
    return max + 1
  }

  const newBlog = () => {
    setEditData({
      id: newId(listBlogs),
      title: "",
      content: "",
      createdBy: "",
      createdAt: null,
    })
    setOpenModal(true)
  }

  useEffect(() => {
    if (!localStorage.getItem("blogs")) {
      localStorage.setItem("blogs", JSON.stringify([]));
    } else {
      if (localStorage?.getItem("blogs") !== null) {
        let listValues = localStorage?.getItem("blogs");
        let array = JSON.parse("[" + listValues + "]");
        setListBlogs(Object.values(array[0]));
      }
    }
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: any, b: any) =>
        moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      defaultSortOrder: "descend",
      ellipsis: true,
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      onCell: (record: any) => {
        return {
          onClick: () => {
            const foundData = listBlogs.find((element) => element.id === record.id);
            setShowModal(true)
            setEditData(foundData)
          },
        };
      },
      render: (text: string) => (
        <div className='action'>
          <EditOutlined />
        </div>
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      onCell: (record: any) => {
        return {
          onClick: () => {
            let result = listBlogs.filter((element) => element.id !== record.id);
            setListBlogs(result);
            localStorage.setItem("blogs", JSON.stringify(result));
            toastNotification("Delete blog successfully!")
          },
        };
      },
      render: (text: string) => (
        <div className='action'>
          <DeleteOutlined className='ml-10' />
        </div>
      ),
    },
  ];
  return (
    <>
      <Head>
        <title>Blogs attributes</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={styles.description}>
          <h6>Blogs attributes</h6>
          <div className={styles.searchBox}>
            <button onClick={newBlog}>Create Blog</button>
            <Input placeholder='Search Blog' onChange={handleChange} />
          </div>
          <Table
            dataSource={listBlogs}
            columns={columns}
            pagination={false}
            rowKey={(r: { id: number }) => r.id}
          />
        </div>

        <ModalsForm
          showModal={showModal}
          setOpen={setOpenModal}
          createBlog={createBlog}
          updateBlog={updateBlog}
          editData={editData}
          dataLength={listBlogs.length}
        />
      </main>
    </>
  );
}
