import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getResourceList, createResource, updateResource, deleteResource,
  getCategoryList, createCategory, updateCategory, deleteCategory,
} from '../../services/resource';

const statusMap = { idle: '空闲', borrowed: '已借出', repair: '维修中' };
const statusColors = { idle: 'green', borrowed: 'blue', repair: 'orange' };

export default function ResourceManage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catData, setCatData] = useState([]);
  const [catForm] = Form.useForm();

  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userInfo.role === 'admin';

  useEffect(() => { fetchData(); fetchCats(); }, []);

  const fetchData = async (page = 1, size = 10, keyword = '') => {
    setLoading(true);
    try {
      const res = await getResourceList({ pageNum: page, pageSize: size, keyword });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const fetchCats = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res.data.map(c => ({ value: c.id, label: c.name })));
      setCatData(res.data);
    } catch { /* handled */ }
  };

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (r) => { setEditingRecord(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleDelete = async (id) => {
    try { await deleteResource(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize, searchKeyword); }
    catch { /* handled */ }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) { await updateResource(editingRecord.id, values); message.success('更新成功'); }
      else { await createResource(values); message.success('创建成功'); }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize, searchKeyword);
    } catch { /* handled */ }
  };

  // 分类操作（admin only）
  const handleCatAdd = () => { setEditingCat(null); catForm.resetFields(); setCatModalOpen(true); };
  const handleCatEdit = (r) => { setEditingCat(r); catForm.setFieldsValue(r); setCatModalOpen(true); };
  const handleCatDelete = async (id) => {
    try { await deleteCategory(id); message.success('删除成功'); fetchCats(); } catch { /* handled */ }
  };
  const handleCatSubmit = async () => {
    try {
      const values = await catForm.validateFields();
      if (editingCat) { await updateCategory(editingCat.id, values); message.success('更新成功'); }
      else { await createCategory(values); message.success('创建成功'); }
      setCatModalOpen(false);
      fetchCats();
    } catch { /* handled */ }
  };

  const columns = [
    { title: '名称', dataIndex: 'name', width: 180 },
    { title: '分类', dataIndex: ['category', 'name'], width: 120, render: (t, r) => r.category?.name || '-' },
    { title: '状态', dataIndex: 'status', width: 90, render: s => <Tag color={statusColors[s]}>{statusMap[s]}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'create_time', width: 170 },
    ...(isAdmin ? [{
      title: '操作', width: 150, fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  const catColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '分类名称', dataIndex: 'name' },
    { title: '备注', dataIndex: 'remark' },
    ...(isAdmin ? [{
      title: '操作', width: 150,
      render: (_, r) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleCatEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleCatDelete(r.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  // Tab 配置
  const tabItems = [
    {
      key: 'resource', label: isAdmin ? '资源列表' : '资源浏览',
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input.Search placeholder="搜索资源名称" value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onSearch={() => fetchData(1, pagination.pageSize, searchKeyword)}
              style={{ width: 240 }} enterButton={<SearchOutlined />} />
            <Select placeholder="按分类筛选" allowClear style={{ width: 150 }}
              options={categories} onChange={v => fetchData(1, pagination.pageSize, searchKeyword)} />
            {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增资源</Button>}
          </Space>
          <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
            pagination={pagination} onChange={p => fetchData(p.current, p.pageSize, searchKeyword)}
            scroll={{ x: 900 }} />
        </>
      ),
    },
    ...(isAdmin ? [{
      key: 'category', label: '分类管理',
      children: (
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCatAdd} style={{ marginBottom: 16 }}>新增分类</Button>
          <Table rowKey="id" columns={catColumns} dataSource={catData} pagination={false} />
        </>
      ),
    }] : []),
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '资源管理' : '资源浏览'}</h2>
      <Tabs defaultActiveKey="resource" items={tabItems} />

      {/* 资源弹窗（admin only） */}
      {isAdmin && (
        <Modal title={editingRecord ? '编辑资源' : '新增资源'} open={modalOpen}
          onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="资源名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="category_id" label="所属分类" rules={[{ required: true }]}>
              <Select options={categories} /></Form.Item>
            <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
            {editingRecord && (
              <Form.Item name="status" label="状态">
                <Select options={[{ value: 'idle', label: '空闲' }, { value: 'borrowed', label: '已借出' }, { value: 'repair', label: '维修中' }]} />
              </Form.Item>
            )}
          </Form>
        </Modal>
      )}

      {/* 分类弹窗（admin only） */}
      {isAdmin && (
        <Modal title={editingCat ? '编辑分类' : '新增分类'} open={catModalOpen}
          onOk={handleCatSubmit} onCancel={() => setCatModalOpen(false)} destroyOnClose>
          <Form form={catForm} layout="vertical">
            <Form.Item name="name" label="分类名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="remark" label="备注"><Input /></Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
