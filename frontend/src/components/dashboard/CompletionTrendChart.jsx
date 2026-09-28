import React from 'react';
import { Box, Skeleton, useTheme, alpha, Typography, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CompletionTrendChart = ({ loading, data }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Format dates to be more readable
  const formattedData = data.map(item => ({
    date: formatDate(item.date || item._id),
    count: item.count,
    fullDate: item.date || item._id
  }));

  // If no data, provide some placeholder data
  const chartData = formattedData.length > 0 ? formattedData : generatePlaceholderData();

  // Find max value for reference line
  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function generatePlaceholderData() {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      data.push({
        date: formatDate(date),
        fullDate: date.toISOString().split('T')[0],
        count: 0
      });
    }
    
    return data;
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.fullDate);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            {formattedDate}
          </Typography>
          <Typography variant="body2">
            {data.count} Tasks Completed
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ 
              top: 20, 
              right: isXsScreen ? 10 : 30, 
              left: isXsScreen ? 0 : 10, 
              bottom: 5 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={alpha(theme.palette.divider, 0.1)} 
              horizontal={true}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: isXsScreen ? 10 : 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: isXsScreen ? 10 : 12 }}
              dx={-10}
              allowDecimals={false}
              domain={[0, maxCount > 5 ? 'auto' : maxCount + 1]}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: alpha(theme.palette.primary.main, 0.2), strokeWidth: 2 }}
            />
            <ReferenceLine 
              y={0} 
              stroke={theme.palette.divider} 
              strokeWidth={1}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke={theme.palette.primary.main} 
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: theme.palette.background.paper, 
                stroke: theme.palette.primary.main, 
                strokeWidth: 2 
              }}
              activeDot={{ 
                r: 6, 
                fill: theme.palette.primary.main, 
                stroke: theme.palette.background.paper,
                strokeWidth: 2
              }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Summary stats */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 3, 
        mt: 1,
        flexWrap: 'wrap'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary">
            Total Completed
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            {chartData.reduce((sum, item) => sum + item.count, 0)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary">
            Average Per Day
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            {chartData.length > 0 
              ? (chartData.reduce((sum, item) => sum + item.count, 0) / chartData.length).toFixed(1) 
              : '0'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary">
            Most Productive Day
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            {chartData.reduce((max, item) => item.count > max.count ? item : max, { count: 0 }).date || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletionTrendChart;