import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Chip, 
  Skeleton, 
  useTheme, 
  alpha,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const UpcomingTasks = ({ loading, tasks }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
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
  };

  // Get days remaining color
  const getDaysRemainingColor = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return theme.palette.error.main;
    if (diffDays === 0) return theme.palette.warning.main;
    if (diffDays <= 2) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 2, flexGrow: 1 }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Skeleton variant="rectangular" width={60} height={24} sx={{ mr: 1, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            </Box>
            {item !== 3 && <Divider sx={{ my: 2, opacity: 0.1 }} />}
          </Box>
        ))}
      </Box>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center'
        }}
      >
        <TaskAltIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No upcoming tasks
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You're all caught up! Add a new task to get started.
        </Typography>
        <Button
          component={Link}
          to="/tasks"
          variant="outlined"
          startIcon={<AddTaskIcon />}
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
          }}
        >
          Add New Task
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
      {tasks.map((task, index) => {
        const daysRemainingColor = getDaysRemainingColor(task.dueDate);
        const daysRemainingText = getDaysRemaining(task.dueDate);
        const isOverdue = daysRemainingText.includes('Overdue');
        
        return (
          <React.Fragment key={task._id}>
            <Box 
              sx={{ 
                p: 2,
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.03)
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ maxWidth: 'calc(100% - 40px)' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="medium" 
                    gutterBottom
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon 
                      fontSize="small" 
                      sx={{ 
                        fontSize: '0.875rem', 
                        mr: 0.5, 
                        color: isOverdue ? theme.palette.error.main : 'text.secondary'
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      color={isOverdue ? "error" : "text.secondary"}
                      sx={{ fontWeight: isOverdue ? 'medium' : 'normal' }}
                    >
                      {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                </Box>
                
                <Tooltip title="View Task">
                  <IconButton 
                    component={Link} 
                    to={`/tasks?id=${task._id}`}
                    size="small"
                    sx={{ 
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<FlagIcon fontSize="small" />}
                  label={task.priority} 
                  size="small"
                  sx={{ 
                    bgcolor: alpha(getPriorityColor(task.priority), 0.1),
                    color: getPriorityColor(task.priority),
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
                
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={daysRemainingText}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(daysRemainingColor, 0.1),
                    color: daysRemainingColor,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Box>
            </Box>
            {index < tasks.length - 1 && <Divider sx={{ opacity: 0.1 }} />}
          </React.Fragment>
        );
      })}
      
      {/* View all tasks button at the bottom */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Button
          component={Link}
          to="/tasks"
          variant="text"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          View All Tasks
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingTasks;