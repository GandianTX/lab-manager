import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '../../services/notice';
import { noticeTypeMap, noticeTypeColors } from '../../utils/constants';
import { useAuth } from '../../utils/useAuth';

const NoticeManage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const { isAdmin } = useAuth();

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const res = await getNoticeList({ pageNum: page, pageSize: size });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); form.setFieldsValue({ type: 'SYSTEM' }); setModalOpen(true); };
  const handleEdit = (r: any) => { setEditingRecord(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateNotice(editingRecord.id, values);
        message.success('修改成功');
      } else {
        await createNotice(values);
        message.success('发布成功');
      }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* handled */ }
  };

  const handleDelete = async (id: number) => {
    try { await deleteNotice(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const columns = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 90, render: (t: string) => <Tag color={noticeTypeColors[t]}>{noticeTypeMap[t] || t}</Tag> },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    ...(isAdmin ? [{
      title: '操作', width: 120,
      render: (_: any, r: any) => (
        <Space className="table-action-space" size={[0, 0]} wrap>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '公告管理' : '公告浏览'}</h2>
      <Space style={{ marginBottom: 16 }}>
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发布公告</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} scroll={{ x: 'max-content' }} onChange={p => fetchData(p.current, p.pageSize)} />

      <Modal title={editingRecord ? '编辑公告' : '发布公告'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="公告类型" rules={[{ required: true }]}>
            <Select options={[
              { value: 'SYSTEM', label: '系统公告' },
              { value: 'EXPERIMENT', label: '实验通知' },
              { value: 'MAINTAIN', label: '维护通知' },
              { value: 'SUSPENSION', label: '停课通知' },
            ]} />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoticeManage;
