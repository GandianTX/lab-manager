import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Select, Input, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getRepairList, createRepair, confirmRepair, rejectRepair, resolveRepair } from '../../services/repair';
import { getDeviceList } from '../../services/device';
import { getLabList } from '../../services/lab';

const statusMap: Record<string, string> = { PENDING: '待处理', CONFIRMED: '已确认', REJECTED: '已驳回', RESOLVED: '已处理' };
const statusColors: Record<string, string> = { PENDING: 'gold', CONFIRMED: 'blue', REJECTED: 'red', RESOLVED: 'green' };

const RepairPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [devices, setDevices] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => { fetchData(); fetchDevices(); fetchLabs(); }, []);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const res = await getRepairList({ pageNum: page, pageSize: size });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const fetchDevices = async () => {
    try {
      const res = await getDeviceList({ pageSize: 999 });
      setDevices(res.data.list.map((d: any) => ({ value: d.id, label: `${d.name} (${d.model || '无型号'})` })));
    } catch { /* handled */ }
  };

  const fetchLabs = async () => {
    try {
      const res = await getLabList({ pageSize: 999 });
      setLabs(res.data.list.map((l: any) => ({ value: l.id, label: l.name })));
    } catch { /* handled */ }
  };

  const handleApply = () => { form.resetFields(); setModalOpen(true); };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createRepair(values);
      message.success('报修申请已提交');
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* handled */ }
  };

  const handleConfirm = async (id: number) => {
    try { await confirmRepair(id); message.success('已确认故障，设备状态已更新'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleReject = async (id: number) => {
    try { await rejectRepair(id); message.success('已驳回'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleResolve = async (id: number) => {
    try { await resolveRepair(id); message.success('已标记处理完成，设备状态已恢复'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const columns = [
    { title: '报修人', dataIndex: ['user', 'username'], width: 100, render: (t: string, r: any) => r.user?.username || '-' },
    { title: '设备', dataIndex: ['device', 'name'], width: 140, render: (t: string, r: any) => r.device?.name || '-' },
    { title: '所属实验室', dataIndex: ['lab', 'name'], width: 140, render: (t: string, r: any) => r.lab?.name || '-' },
    { title: '故障描述', dataIndex: 'fault_description', ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 100, render: (s: string) => <Tag color={statusColors[s]}>{statusMap[s]}</Tag> },
    { title: '创建时间', dataIndex: 'create_time', width: 170 },
    {
      title: '操作', width: 180, fixed: 'right' as const,
      render: (_: any, r: any) => (
        <Space>
          {isAdmin && r.status === 'PENDING' && (
            <>
              <Button type="link" onClick={() => handleConfirm(r.id)}>确认</Button>
              <Button type="link" danger onClick={() => handleReject(r.id)}>驳回</Button>
            </>
          )}
          {isAdmin && r.status === 'CONFIRMED' && (
            <Popconfirm title="确认已处理？" onConfirm={() => handleResolve(r.id)}>
              <Button type="link">已处理</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '报修管理' : '我的报修'}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleApply}>提交报修</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize)}
        scroll={{ x: 1000 }} />

      <Modal title="提交报修" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="lab_id" label="所属实验室" rules={[{ required: true }]}>
            <Select options={labs} placeholder="请选择实验室" />
          </Form.Item>
          <Form.Item name="device_id" label="故障设备" rules={[{ required: true }]}>
            <Select options={devices} placeholder="请选择设备" showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="fault_description" label="故障描述" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="请详细描述设备故障情况" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RepairPage;
