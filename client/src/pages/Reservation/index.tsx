import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Select, Input, DatePicker, TimePicker, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getReservationList, createReservation, approveReservation, rejectReservation, finishReservation, cancelReservation } from '../../services/reservation';
import { getLabList } from '../../services/lab';
import { reservationStatusMap, reservationStatusColors } from '../../utils/constants';
import { useAuth } from '../../utils/useAuth';
import dayjs from 'dayjs';

const ReservationPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [labs, setLabs] = useState<any[]>([]);
  const [form] = Form.useForm();

  const { isAdmin } = useAuth();

  useEffect(() => { fetchData(); fetchLabs(); }, []);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const res = await getReservationList({ pageNum: page, pageSize: size });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const fetchLabs = async () => {
    try {
      const res = await getLabList({ pageSize: 999, status: 'OPEN' });
      setLabs(res.data.list.map((l: any) => ({ value: l.id, label: `${l.name} (${l.location})` })));
    } catch { /* handled */ }
  };

  const handleApply = () => { form.resetFields(); setModalOpen(true); };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        lab_id: values.lab_id,
        date: values.date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
        purpose: values.purpose,
      };
      await createReservation(params);
      message.success('预约申请已提交');
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* handled */ }
  };

  const handleApprove = async (id: number) => {
    try { await approveReservation(id); message.success('已通过'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleReject = async (id: number) => {
    try { await rejectReservation(id); message.success('已驳回'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleFinish = async (id: number) => {
    try { await finishReservation(id); message.success('已完成'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleCancel = async (id: number) => {
    try { await cancelReservation(id); message.success('已取消'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const columns = [
    { title: '预约人', dataIndex: ['user', 'username'], width: 80, render: (t: string, r: any) => r.user?.username || '-' },
    { title: '实验室', dataIndex: ['lab', 'name'], ellipsis: true, render: (t: string, r: any) => r.lab?.name || '-' },
    { title: '预约日期', dataIndex: 'date', width: 110 },
    { title: '时间段', width: 140, render: (_: any, r: any) => `${r.start_time?.substring(0, 5)} ~ ${r.end_time?.substring(0, 5)}` },
    { title: '用途', dataIndex: 'purpose', ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={reservationStatusColors[s]}>{reservationStatusMap[s]}</Tag> },
    {
      title: '操作', width: 160,
      render: (_: any, r: any) => (
        <Space size={0}>
          {isAdmin && r.status === 'PENDING' && (
            <>
              <Button type="link" size="small" onClick={() => handleApprove(r.id)}>通过</Button>
              <Button type="link" size="small" danger onClick={() => handleReject(r.id)}>驳回</Button>
            </>
          )}
          {isAdmin && r.status === 'APPROVED' && (
            <Popconfirm title="确认完成？" onConfirm={() => handleFinish(r.id)}>
              <Button type="link" size="small">完成</Button>
            </Popconfirm>
          )}
          {(r.status === 'PENDING' || r.status === 'APPROVED') && (
            <Popconfirm title="确认取消？" onConfirm={() => handleCancel(r.id)}>
              <Button type="link" size="small" danger>取消</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isAdmin ? '预约管理' : '我的预约'}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleApply}>提交预约申请</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize)} />

      <Modal title="提交预约申请" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="lab_id" label="选择实验室" rules={[{ required: true }]}>
            <Select options={labs} placeholder="请选择开放中的实验室" />
          </Form.Item>
          <Form.Item name="date" label="预约日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
          </Form.Item>
          <Form.Item name="start_time" label="开始时间" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} minuteStep={30} />
          </Form.Item>
          <Form.Item name="end_time" label="结束时间" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} minuteStep={30} />
          </Form.Item>
          <Form.Item name="purpose" label="预约用途">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReservationPage;
