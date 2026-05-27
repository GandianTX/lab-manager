import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { TeamOutlined, ToolOutlined, ScheduleOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getDashboardStats } from '../../services/dashboard';

echarts.use([LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  // 借用趋势折线图配置
  const trendOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (stats.trend || []).map(t => t.date) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      name: '借用次数', type: 'line', smooth: true,
      data: (stats.trend || []).map(t => t.count),
      itemStyle: { color: '#1890ff' },
    }],
  };

  // 资源分类饼图配置
  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      name: '资源分类', type: 'pie', radius: ['40%', '70%'],
      data: (stats.categoryPie || []).filter(c => c.value > 0),
      label: { show: true, formatter: '{b}: {c}' },
    }],
  };

  const cards = [
    { title: '用户总数', value: stats.userCount, icon: <TeamOutlined />, color: '#1890ff' },
    { title: '资源总数', value: stats.resourceCount, icon: <ToolOutlined />, color: '#52c41a' },
    { title: '借用记录', value: stats.borrowCount, icon: <ScheduleOutlined />, color: '#722ed1' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统概览</h2>
      <Row gutter={[16, 16]}>
        {cards.map((c, i) => (
          <Col xs={24} sm={8} key={i}>
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
          <Card title="借用趋势">
            {(stats.trend || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={trendOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无借用数据</div>}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="资源分类分布">
            {(stats.categoryPie || []).length > 0
              ? <ReactEChartsCore echarts={echarts} option={pieOption} style={{ height: 300 }} />
              : <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无分类数据</div>}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
