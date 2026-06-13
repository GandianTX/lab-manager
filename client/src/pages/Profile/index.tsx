import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Descriptions, Spin, Modal } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { getCurrentUser, updateProfile } from '../../services/user';
import { useAuth } from '../../utils/useAuth';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, []);

  const handleEdit = () => {
    form.setFieldsValue({ password: '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const params: any = {};
      if (values.password) params.password = values.password;
      await updateProfile(params);
      message.success('修改成功，请重新登录');
      localStorage.clear();
      window.location.href = '/login';
    } catch { /* handled */ }
  };

  const { user: localUser } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 24 }}>个人信息</h2>
      <Card>
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label={<><UserOutlined /> 用户名</>}>
            {user?.username || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {localUser.role === 'admin' ? '管理员' : '学生'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {user?.create_time || '-'}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            修改密码
          </Button>
        </div>
      </Card>

      <Modal title="修改密码" open={modalOpen} onOk={handleSubmit}
        onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="password" label="新密码" rules={[{ required: true, min: 6, message: '至少6位' }]}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
