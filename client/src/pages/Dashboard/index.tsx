import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, List } from 'antd';
import {
  TeamOutlined, ToolOutlined, ScheduleOutlined,
  AlertOutlined, ClockCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getDashboardStats } from '../../services/dashboard';
import { deviceStatusMap as deviceStatusConstMap, repairStatusMap as repairStatusConstMap, reservationStatusMap as reservationStatusConstMap } from '../../utils/constants';
import { useAuth } from '../../utils/useAuth';

echarts.use([LineChart, PieChart, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isAdmin } = useAuth();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  if (isAdmin) {
    return <AdminDashboard stats={stats} />;
  }
  return <StudentDashboard stats={stats} />;
};

/** 管理员仪表盘 */
const AdminDashboard: React.FC<{ stats: any }> = ({ stats }) => {
  const cards = [
    { title: '实验室总数', value: stats?.labCount, icon: <TeamOutlined />, color: '#1890ff' },
    { title: '设备总数', value: stats?.deviceCount, icon: <ToolOutlined />, color: '#52c41a' },
    { title: '学生总数', value: stats?.studentCount, icon: <TeamOutlined />, color: '#722ed1' },
    { title: '预约总数', value: stats?.reservationCount, icon: <ScheduleOutlined />, color: '#fa8c16' },
    { title: '报修总数', value: stats?.repairCount, icon: <AlertOutlined />, color: '#f5222d' },
    { title: '待审核预约', value: stats?.pendingReservation, icon: <ClockCircleOutlined />, color: '#faad14' },
    { title: '待审核报修', value: stats?.pendingRepair, icon: <ClockCircleOutlined />, color: '#eb2f96' },
  ];

  const trendOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (stats?.trend || []).map((t: any) => t.date) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{ name: '预约次数', type: 'line', smooth: true, data: (stats?.trend || []).map((t: any) => t.count), itemStyle: { color: '#1890ff' } }],
  };

  const labRankOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (stats?.labRank || []).map((l: any) => l.name) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{ name: '预约次数', type: 'bar', data: (stats?.labRank || []).map((l: any) => l.value), itemStyle: { color: '#722ed1' } }],
  };

  const devicePieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{ name: '设备状态', type: 'pie', radius: ['40%', '70%'], data: (stats?.deviceStatus || []).map((d: any) => ({ name: deviceStatusConstMap[d.name] || d.name, value: d.value })), label: { show: true, formatter: '{b}: {c}' } }],
  };

  const repairPieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{ name: '报修统计', type: 'pie', radius: ['40%', '70%'], data: (stats?.repairStatus || []).map((r: any) => ({ name: repairStatusConstMap[r.name] || r.name, value: r.value })), label: { show: true, formatter: '{b}: {c}' } }],
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统概览（管理员）</h2>
      <Row gutter={[16, 16]}>
        {cards.map((c, i) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={i}>
            <Card>
              <Statistic title={c.title} value={c.value}
                prefix={React.cloneElement(c.icon, { style: { color: c.color, fontSize: 24 } })}
                valueStyle={{ color: c.color }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="实验室预约趋势">
            {(stats?.trend || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={trendOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="实验室预约排行">
            {(stats?.labRank || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={labRankOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="设备状态统计">
            {(stats?.deviceStatus || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={devicePieOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="报修统计">
            {(stats?.repairStatus || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={repairPieOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/** 学生仪表盘 */
const StudentDashboard: React.FC<{ stats: any }> = ({ stats }) => {
  const cards = [
    { title: '实验室总数', value: stats?.labCount, icon: <TeamOutlined />, color: '#1890ff' },
    { title: '设备总数', value: stats?.deviceCount, icon: <ToolOutlined />, color: '#52c41a' },
    { title: '我的预约', value: stats?.myReservationCount, icon: <ScheduleOutlined />, color: '#722ed1' },
    { title: '待审核', value: stats?.pendingCount, icon: <ClockCircleOutlined />, color: '#faad14' },
    { title: '已通过', value: stats?.approvedCount, icon: <CheckCircleOutlined />, color: '#52c41a' },
  ];

  const statusPieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{ name: '预约状态', type: 'pie', radius: ['40%', '70%'], data: (stats?.statusPie || []).map((s: any) => ({ name: reservationStatusConstMap[s.name] || s.name, value: s.value })), label: { show: true, formatter: '{b}: {c}' } }],
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (stats?.trend || []).map((t: any) => t.date) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{ name: '预约次数', type: 'line', smooth: true, data: (stats?.trend || []).map((t: any) => t.count), itemStyle: { color: '#1890ff' } }],
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统概览</h2>
      <Row gutter={[16, 16]}>
        {cards.map((c, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Card>
              <Statistic title={c.title} value={c.value}
                prefix={React.cloneElement(c.icon, { style: { color: c.color, fontSize: 24 } })}
                valueStyle={{ color: c.color }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="我的预约趋势">
            {(stats?.trend || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={trendOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="预约状态统计">
            {(stats?.statusPie || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={statusPieOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无数据</div>}
          </Card>
        </Col>
      </Row>
      {stats?.latestNotices && stats.latestNotices.length > 0 && (
        <Card title="最新公告" style={{ marginTop: 24 }}>
          <List dataSource={stats.latestNotices} renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.content} />
              <div style={{ color: '#999', fontSize: 12 }}>{item.create_time}</div>
            </List.Item>
          )} />
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
