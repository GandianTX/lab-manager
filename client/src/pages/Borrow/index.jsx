import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Select, Input, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBorrowList, createBorrow, approveBorrow, rejectBorrow, returnBorrow } from '../../services/borrow';
import { getResourceList } from '../../services/resource';

const statusMap = { pending: '待审批', approved: '已通过', rejected: '已驳回', returned: '已归还' };
const statusColors = { pending: 'gold', approved: 'green', rejected: 'red', returned: 'default' };

export default function BorrowManage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [resources, setResources] = useState([]);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => { fetchData(); fetchResources(); }, []);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const res = await getBorrowList({ pageNum: page, pageSize: size });
      setData(res.data.list);
      setPagination({ current: page, pageSize: size, total: res.data.total });
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const fetchResources = async () => {
    try {
      const res = await getResourceList({ pageSize: 999, status: 'idle' });
      setResources(res.data.list.map(r => ({ value: r.id, label: r.name })));
    } catch { /* handled */ }
  };

  const handleApply = () => { form.resetFields(); setModalOpen(true); };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createBorrow(values);
      message.success('申请已提交');
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
      fetchResources();
    } catch { /* handled */ }
  };

  const handleApprove = async (id) => {
    try { await approveBorrow(id); message.success('已通过'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: '驳回借用申请',
      content: <Input.TextArea id="reject-remark" placeholder="驳回原因（选填）" />,
      onOk: async () => {
        const remark = document.getElementById('reject-remark')?.value;
        try { await rejectBorrow(record.id, { remark }); message.success('已驳回'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
      },
    });
  };

  const handleReturn = async (id) => {
    try { await returnBorrow(id); message.success('已归还'); fetchData(pagination.current, pagination.pageSize); } catch { /* handled */ }
  };

  const columns = [
    { title: '借用人', dataIndex: ['user', 'username'], width: 100, render: (t, r) => r.user?.username || '-' },
    { title: '资源', dataIndex: ['resource', 'name'], width: 150, render: (t, r) => r.resource?.name || '-' },
    { title: '状态', dataIndex: 'status', width: 90, render: s => <Tag color={statusColors[s]}>{statusMap[s]}</Tag> },
    { title: '借用时间', dataIndex: 'borrow_time', width: 170 },
    { title: '归还时间', dataIndex: 'return_time', width: 170 },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    { title: '创建时间', dataIndex: 'create_time', width: 170 },
    {
      title: '操作', width: 200, fixed: 'right',
      render: (_, r) => (
        <Space>
          {isAdmin && r.status === 'pending' && (
            <>
              <Button type="link" onClick={() => handleApprove(r.id)}>通过</Button>
              <Button type="link" danger onClick={() => handleReject(r)}>驳回</Button>
            </>
          )}
          {r.status === 'approved' && (
            <Popconfirm title="确认归还？" onConfirm={() => handleReturn(r.id)}>
              <Button type="link">归还</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>借用管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleApply}>提交借用申请</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={pagination} onChange={p => fetchData(p.current, p.pageSize)}
        scroll={{ x: 1100 }} />

      <Modal title="提交借用申请" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="resource_id" label="选择资源" rules={[{ required: true }]}>
            <Select options={resources} placeholder="请选择空闲资源" />
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
