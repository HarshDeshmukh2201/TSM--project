import React from 'react';
import { Box, Typography, useTheme, alpha, Skeleton, useMediaQuery } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TaskPriorityChart = ({ loading, data }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Skeleton variant="circular" width={160} height={160} />
      </Box>
    );
  }

  // Ensure we have data for all priority levels
  const priorityLevels = ['High', 'Medium', 'Low'];
  const completeData = priorityLevels.map(priority => {
    const existingData = data.find(item => item.name === priority);
    return existingData || { name: priority, value: 0, color: getPriorityColor(priority) };
  });

  function getPriorityColor(priority) {
    switch(priority?.toLowerCase()) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  }

  // Calculate total for percentages
  const total = completeData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? Math.round((data.value / total) * 100) : 0;
      
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
          <Typography variant="subtitle2" sx={{ color: data.color, fontWeight: 'bold' }}>
            {data.name} Priority
          </Typography>
          <Typography variant="body2">
            {data.value} Tasks ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={completeData}
              cx="50%"
              cy="50%"
              innerRadius={isXsScreen ? 40 : 60}
              outerRadius={isXsScreen ? 60 : 80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              animationDuration={1000}
              animationBegin={300}
            >
              {completeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        gap: 2, 
        mt: 2,
        px: 1
      }}>
        {completeData.map((entry) => {
          const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <Box 
              key={entry.name} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: alpha(entry.color, 0.1),
                px: 1.5,
                py: 0.5,
                borderRadius: 2
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  bgcolor: entry.color,
                  mr: 1
                }} 
              />
              <Typography variant="caption" fontWeight="medium" color={entry.color}>
                {entry.name}: {entry.value} ({percentage}%)
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TaskPriorityChart;