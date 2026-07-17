import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getUserList, createUser, updateUser, deleteUser } from '../../services/user';
import { roleLabels, roleColors } from '../../utils/constants';
import { useAuth } from '../../utils/useAuth';

const UserManage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form] = Form.useForm();

  const { isAdmin } = useAuth();

  const fetchData = async (page = 1, size = 10, keyword = '') => {
    setLoading(true);
    try {
      const res = await getUserList({ pageNum: page, pageSize: size, keyword });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (r: any) => { setEditingRecord(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    try { await deleteUser(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize, searchKeyword); }
    catch { /* handled */ }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        if (!values.password) delete values.password;
        await updateUser(editingRecord.id, values);
        message.success('更新成功');
      } else {
        await createUser(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize, searchKeyword);
    } catch { /* handled */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: '用户名', dataIndex: 'username', ellipsis: true },
    { title: '角色', dataIndex: 'role', width: 80,
      render: (r: string) => <Tag color={roleColors[r]}>{roleLabels[r] || r}</Tag> },
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
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="搜索用户名" value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onSearch={() => fetchData(1, pagination.pageSize, searchKeyword)}
          style={{ width: 240 }} enterButton={<SearchOutlined />} />
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} scroll={{ x: 'max-content' }} onChange={p => fetchData(p.current, p.pageSize, searchKeyword)} />

      {isAdmin && (
        <Modal title={editingRecord ? '编辑用户' : '新增用户'} open={modalOpen}
          onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
          <Form form={form} layout="vertical">
            <Form.Item name="username" label="用户名" rules={[{ required: true, min: 3 }]}>
              <Input disabled={!!editingRecord} />
            </Form.Item>
            <Form.Item name="password" label="密码"
              rules={editingRecord ? [] : [{ required: true, min: 6 }]}>
              <Input.Password placeholder={editingRecord ? '不修改请留空' : '请输入密码'} />
            </Form.Item>
            <Form.Item name="role" label="角色" rules={[{ required: true }]}>
              <Select options={[{ value: 'admin', label: '管理员' }, { value: 'student', label: '学生' }]} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default UserManage;
