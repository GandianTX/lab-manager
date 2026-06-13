import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getDeviceList, createDevice, updateDevice, deleteDevice } from '../../services/device';
import { getLabList } from '../../services/lab';

const statusMap: Record<string, string> = { NORMAL: '正常', BROKEN: '故障', MAINTAINING: '维护中', DISABLED: '停用' };
const statusColors: Record<string, string> = { NORMAL: 'green', BROKEN: 'red', MAINTAINING: 'orange', DISABLED: 'default' };

const DevicePage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [labs, setLabs] = useState<any[]>([]);
  const [form] = Form.useForm();

  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userInfo.role === 'admin';

  useEffect(() => { fetchData(); fetchLabs(); }, []);

  const fetchData = async (page = 1, size = 10, keyword = '') => {
    setLoading(true);
    try {
      const res = await getDeviceList({ pageNum: page, pageSize: size, keyword });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const fetchLabs = async () => {
    try {
      const res = await getLabList({ pageSize: 999 });
      setLabs(res.data.list.map((l: any) => ({ value: l.id, label: l.name })));
    } catch { /* handled */ }
  };

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); form.setFieldsValue({ status: 'NORMAL' }); setModalOpen(true); };
  const handleEdit = (r: any) => { setEditingRecord(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    try { await deleteDevice(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize, searchKeyword); }
    catch { /* handled */ }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) { await updateDevice(editingRecord.id, values); message.success('更新成功'); }
      else { await createDevice(values); message.success('创建成功'); }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize, searchKeyword);
    } catch { /* handled */ }
  };

  const columns = [
    { title: '设备名称', dataIndex: 'name', width: 160 },
    { title: '型号', dataIndex: 'model', width: 140 },
    { title: '所属实验室', dataIndex: ['lab', 'name'], width: 150, render: (t: string, r: any) => r.lab?.name || '-' },
    { title: '状态', dataIndex: 'status', width: 100, render: (s: string) => <Tag color={statusColors[s]}>{statusMap[s]}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'create_time', width: 170 },
    ...(isAdmin ? [{
      title: '操作', width: 150, fixed: 'right' as const,
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '设备管理' : '设备浏览'}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="搜索设备名称" value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onSearch={() => fetchData(1, pagination.pageSize, searchKeyword)}
          style={{ width: 240 }} enterButton={<SearchOutlined />} />
        <Select placeholder="按实验室筛选" allowClear style={{ width: 180 }}
          options={labs} onChange={() => fetchData(1, pagination.pageSize, searchKeyword)} />
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增设备</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize, searchKeyword)}
        scroll={{ x: 1000 }} />

      {isAdmin && (
        <Modal title={editingRecord ? '编辑设备' : '新增设备'} open={modalOpen}
          onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="设备名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="model" label="设备型号">
              <Input />
            </Form.Item>
            <Form.Item name="lab_id" label="所属实验室" rules={[{ required: true }]}>
              <Select options={labs} placeholder="请选择实验室" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select options={[
                { value: 'NORMAL', label: '正常' },
                { value: 'BROKEN', label: '故障' },
                { value: 'MAINTAINING', label: '维护中' },
                { value: 'DISABLED', label: '停用' },
              ]} />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default DevicePage;
