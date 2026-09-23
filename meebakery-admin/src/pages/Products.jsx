import React from 'react';
import { Table, Tag, Alert, Card, Statistic, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

const getCategoryEmoji = (name) => {
  if (!name) return '🌰';
  if (name.includes('quy') || name.includes('Cookies')) return '🍪';
  if (name.includes('mì') || name.includes('chuối')) return '🍞';
  if (name.includes('Croissant')) return '🥐';
  if (name.includes('kem')) return '🍰';
  return '🌰';
};

export default function Products() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/api/products').then((r) => r.data),
  });

  const columns = [
    {
      title: 'Ảnh',
      key: 'image',
      width: 70,
      render: (_, r) => (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            background: '#EAF8FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          {getCategoryEmoji(r.category_name)}
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (v) => <b style={{ color: '#438A9C' }}>{v}</b>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_name',
      key: 'category',
      render: (v) => <Tag color="cyan">{v || 'Khác'}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (v) => <b style={{ color: '#FF5A5F' }}>{formatPrice(v)}</b>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (v) => (
        <Tag color={v > 0 ? 'green' : 'red'}>
          {v > 0 ? `${v} sản phẩm` : 'Hết hàng'}
        </Tag>
      ),
    },
  ];

  if (error) {
    return (
      <Alert
        type="error"
        message="Không thể tải sản phẩm"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <h1 style={{ color: '#356F7C', marginBottom: 20, fontSize: 24 }}>
        Quản lý sản phẩm
      </h1>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={products.length}
              Style={{ color: '#438A9C', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Còn hàng"
              value={products.filter((p) => p.stock > 0).length}
              Style={{ color: '#4D9B68', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hết hàng"
              value={products.filter((p) => p.stock <= 0).length}
              Style={{ color: '#FF5A5F', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Danh mục"
              value={new Set(products.map((p) => p.category_name)).size}
              valueStyle={{ color: '#438A9C', fontWeight: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={products}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}