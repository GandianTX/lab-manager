import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getLabList, createLab, updateLab, deleteLab, getLabDetail } from '../../services/lab';

const statusMap: Record<string, string> = { OPEN: '开放中', MAINTAIN: '维护中', DISABLED: '停用' };
const statusColors: Record<string, string> = { OPEN: 'green', MAINTAIN: 'orange', DISABLED: 'red' };

const LabPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form] = Form.useForm();

  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userInfo.role === 'admin';

  const fetchData = async (page = 1, size = 10, keyword = '') => {
    setLoading(true);
    try {
      const res = await getLabList({ pageNum: page, pageSize: size, keyword });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); form.setFieldsValue({ capacity: 30, status: 'OPEN' }); setModalOpen(true); };
  const handleEdit = (r: any) => { setEditingRecord(r); form.setFieldsValue(r); setModalOpen(true); };
  const handleDetail = async (id: number) => {
    try {
      const res = await getLabDetail(id);
      setDetailData(res.data);
      setDetailOpen(true);
    } catch { /* handled */ }
  };

  const handleDelete = async (id: number) => {
    try { await deleteLab(id); message.success('删除成功'); fetchData(pagination.current, pagination.pageSize, searchKeyword); }
    catch { /* handled */ }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) { await updateLab(editingRecord.id, values); message.success('更新成功'); }
      else { await createLab(values); message.success('创建成功'); }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize, searchKeyword);
    } catch { /* handled */ }
  };

  const columns = [
    { title: '实验室名称', dataIndex: 'name', width: 180 },
    { title: '位置', dataIndex: 'location', width: 150 },
    { title: '容纳人数', dataIndex: 'capacity', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: (s: string) => <Tag color={statusColors[s]}>{statusMap[s]}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'create_time', width: 170 },
    {
      title: '操作', width: 200, fixed: 'right' as const,
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(r.id)}>详情</Button>
          {isAdmin && <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>}
          {isAdmin && (
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '实验室管理' : '实验室浏览'}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="搜索实验室名称" value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onSearch={() => fetchData(1, pagination.pageSize, searchKeyword)}
          style={{ width: 240 }} enterButton={<SearchOutlined />} />
        <Select placeholder="按状态筛选" allowClear style={{ width: 130 }}
          options={[{ value: 'OPEN', label: '开放中' }, { value: 'MAINTAIN', label: '维护中' }, { value: 'DISABLED', label: '停用' }]}
          onChange={v => fetchData(1, pagination.pageSize, searchKeyword)} />
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增实验室</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize, searchKeyword)}
        scroll={{ x: 1000 }} />

      {/* 新增/编辑弹窗 */}
      {isAdmin && (
        <Modal title={editingRecord ? '编辑实验室' : '新增实验室'} open={modalOpen}
          onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="实验室名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="location" label="实验室位置" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="capacity" label="容纳人数" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select options={[{ value: 'OPEN', label: '开放中' }, { value: 'MAINTAIN', label: '维护中' }, { value: 'DISABLED', label: '停用' }]} />
            </Form.Item>
            <Form.Item name="description" label="简介">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* 详情弹窗 */}
      <Modal title="实验室详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={600}>
        {detailData && (
          <div>
            <p><strong>名称：</strong>{detailData.name}</p>
            <p><strong>位置：</strong>{detailData.location}</p>
            <p><strong>容纳人数：</strong>{detailData.capacity}</p>
            <p><strong>状态：</strong><Tag color={statusColors[detailData.status]}>{statusMap[detailData.status]}</Tag></p>
            <p><strong>简介：</strong>{detailData.description || '-'}</p>
            {detailData.devices && detailData.devices.length > 0 && (
              <>
                <p><strong>设备列表：</strong></p>
                <Table rowKey="id" size="small" pagination={false}
                  dataSource={detailData.devices}
                  columns={[
                    { title: '设备名称', dataIndex: 'name' },
                    { title: '型号', dataIndex: 'model' },
                    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === 'NORMAL' ? 'green' : s === 'BROKEN' ? 'red' : 'orange'}>{s}</Tag> },
                  ]} />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LabPage;
