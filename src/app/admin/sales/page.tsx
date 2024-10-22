// sales.tsx
'use client'
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../queries/admin-queries';
import client from '@/services/apollo-client';
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Users, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './sales.module.css';

interface Booking {
  id: string;
  startdate: string;
  enddate: string;
  amount: number;
  RentedVehicle: {
    Vehicle: {
      type: string;
    };
  };
}

interface GetBookingsData {
  getBookings: Booking[];
}

const Sales = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const { loading, error, data } = useQuery<GetBookingsData>(GET_BOOKINGS, { client });

  const processedData = useMemo(() => {
    if (!data?.getBookings) return null;

    const monthlyData: { [key: string]: any } = {};
    let totalRev = 0;
    let totalBookings = 0;

    data.getBookings.forEach(booking => {
      const date = new Date(booking.startdate);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          revenue: 0,
          bookings: 0,
          avgValue: 0
        };
      }

      monthlyData[month].revenue += booking.amount;
      monthlyData[month].bookings += 1;
      totalRev += booking.amount;
      totalBookings += 1;
    });

    // Calculate averages and convert to array
    const chartData = Object.values(monthlyData).map(month => ({
      ...month,
      avgValue: month.revenue / month.bookings
    }));

    return {
      chartData,
      totalRevenue: totalRev,
      totalBookings,
      averageValue: totalRev / totalBookings
    };
  }, [data]);

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className={styles.statCard}>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <p className={styles.statTitle}>{title}</p>
          <p className={styles.statValue}>{value}</p>
        </div>
        <div className={`${styles.iconContainer} ${trend > 0 ? styles.positive : styles.negative}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className={styles.trendContainer}>
        {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span className={trend > 0 ? styles.positiveTrend : styles.negativeTrend}>
          {Math.abs(trend)}% from last month
        </span>
      </div>
    </div>
  );

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  if (!processedData) return <div className={styles.noData}>No data available</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales Dashboard</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'monthly' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'quarterly' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('quarterly')}
          >
            Quarterly
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'yearly' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Revenue"
          value={`$${processedData.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend={8.2}
        />
        <StatCard
          title="Total Bookings"
          value={processedData.totalBookings.toLocaleString()}
          icon={Users}
          trend={5.1}
        />
        <StatCard
          title="Average Booking Value"
          value={`$${processedData.averageValue.toFixed(2)}`}
          icon={CreditCard}
          trend={-2.3}
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Revenue Overview</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--primary-color)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Booking Trends</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  fill="var(--secondary-color-light)"
                  stroke="var(--secondary-color)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="avgValue"
                  stroke="var(--accent-color)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent-color)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;