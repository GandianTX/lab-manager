import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getNoticeList, createNotice, deleteNotice } from '../../services/notice';

export default function NoticeManage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const res = await getNoticeList({ pageNum: page, pageSize: size });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { form.resetFields(); setModalOpen(true); };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createNotice(values);
      message.success('发布成功');
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* handled */ }
  };

  const handleDelete = async (id) => {
    try { await deleteNotice(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const columns = [
    { title: '标题', dataIndex: 'title', width: 250 },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '发布时间', dataIndex: 'create_time', width: 180 },
    ...(isAdmin ? [{
      title: '操作', width: 80,
      render: (_, r) => (
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    }] : []),
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>公告管理</h2>
      <Space style={{ marginBottom: 16 }}>
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发布公告</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize)}
        scroll={{ x: 700 }} />

      <Modal title="发布公告" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="content" label="内容"><Input.TextArea rows={5} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
