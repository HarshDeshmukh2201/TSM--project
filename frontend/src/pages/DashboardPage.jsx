import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  alpha, 
  Divider,
  Button,
  Fade,
  Zoom,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TaskStatCards from '../components/dashboard/TaskStatCards';
import TaskPriorityChart from '../components/dashboard/TaskPriorityChart';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import CompletionTrendChart from '../components/dashboard/CompletionTrendChart';
import { useAuth } from '../context/AuthContext';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function DashboardPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [dueTasks, setDueTasks] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [loading, setLoading] = useState({
    tasks: true,
    dueTasks: true,
    priorityData: true,
    completionData: true
  });
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Fetch all data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all tasks
        const tasksResponse = await axios.get('/api/tasks');
        setTasks(tasksResponse.data);
        setLoading(prev => ({ ...prev, tasks: false }));

        // Fetch due tasks
        const dueTasksResponse = await axios.get('/api/tasks/due');
        setDueTasks(dueTasksResponse.data);
        setLoading(prev => ({ ...prev, dueTasks: false }));

        // Fetch priority chart data
        const priorityResponse = await axios.get('/api/tasks/charts/priority');
        // Transform the API response to match the chart component's expected format
        const formattedPriorityData = priorityResponse.data.map(item => ({
          name: item._id,
          value: item.count,
          color: getPriorityColor(item._id)
        }));
        setPriorityData(formattedPriorityData);
        setLoading(prev => ({ ...prev, priorityData: false }));

        // Fetch completion trend data
        const completionResponse = await axios.get('/api/tasks/charts/completion');
        // The API already returns data in the format we need (_id as date, count as count)
        setCompletionData(completionResponse.data);
        setLoading(prev => ({ ...prev, completionData: false }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set loading to false even if there's an error
        setLoading({
          tasks: false,
          dueTasks: false,
          priorityData: false,
          completionData: false
        });
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    
    return { total, completed, pending };
  };

  // Get color for priority
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

  // Get upcoming tasks (due in the next 7 days)
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek && !task.completed;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  // Simulate page load for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check if all data is loaded
  const isAllDataLoaded = !Object.values(loading).some(status => status === true);

  // Loading state for the entire dashboard
  if (Object.values(loading).every(status => status === true)) {
    return (
      <Box 
        display="flex" 
        height="100vh" 
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? theme.palette.background.default 
            : 'linear-gradient(to right, #f5f7fa, #f8f9fa)'
        }}
      >
        <Sidebar />
        <Box 
          component="main" 
          flex={1} 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your dashboard...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      height="100vh" 
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? theme.palette.background.default 
          : 'linear-gradient(to right, #f5f7fa, #f8f9fa)'
      }}
    >
      <Sidebar />
      <Box 
        component="main" 
        flex={1} 
        sx={{ 
          overflowY: 'auto',
          transition: 'all 0.3s ease',
          px: isMobile ? 0 : 1, 
          ml: isMobile ? -4 : 0, 
          pt: isMobile ? 9 : 1, 
          pb: 3,
        }}
      >
        <Helmet>
          <title>Dashboard | Task Manager</title>
        </Helmet>

        <Fade in={pageLoaded} timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 2, md: 3 },
            px: isMobile ? 2 : 0,
          }}>
            {/* Welcome Card - Full Width */}
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: isMobile ? { xs: 3, sm: 3 } : 3,
                mx: isMobile && isXsScreen ? 0 : 0,
                background: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  right: -20, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.1)' 
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -30, 
                  left: 20, 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.1)' 
                }} 
              />
              <CardContent sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome back, {user?.username || 'User'}!
                </Typography>
                {isAllDataLoaded && (
                  <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: { xs: '100%', md: '60%' } }}>
                    Here's an overview of your tasks and activities. You have {getTaskStats().pending} pending tasks and {dueTasks.length} overdue tasks.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Task Statistics Cards - Using the fixed component */}
            <TaskStatCards 
              loading={loading.tasks} 
              stats={getTaskStats()} 
              pageLoaded={pageLoaded} 
            />

            {/* Charts Row - 50/50 Split */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 3 },
              width: '100%'
            }}>
              {/* Task Priority Chart - 50% width on desktop */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                <Zoom in={pageLoaded} style={{ transitionDelay: pageLoaded ? '400ms' : '0ms' }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3,
                      height: '100%',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mr: 1.5
                          }}
                        >
                          <PieChartIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Task Priority
                        </Typography>
                      </Box>
                      <TaskPriorityChart 
                        loading={loading.priorityData} 
                        data={priorityData} 
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Completion Trend Chart - 50% width on desktop */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                <Zoom in={pageLoaded} style={{ transitionDelay: pageLoaded ? '500ms' : '0ms' }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3,
                      height: '100%',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            mr: 1.5
                          }}
                        >
                          <TrendingUpIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Completion Trend
                        </Typography>
                      </Box>
                      <CompletionTrendChart 
                        loading={loading.completionData} 
                        data={completionData} 
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            </Box>

            {/* Upcoming Tasks - Full Width */}
            <Box sx={{ width: '100%' }}>
              <Zoom in={pageLoaded} style={{ transitionDelay: pageLoaded ? '600ms' : '0ms' }}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            mr: 1.5
                          }}
                        >
                          <EventNoteIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Upcoming Tasks
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined"
                        size="small"
                        href="/tasks"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        View All
                      </Button>
                    </Box>
                    
                    <Divider sx={{ opacity: 0.1 }} />
                    
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <UpcomingTasks 
                        loading={loading.tasks} 
                        tasks={getUpcomingTasks()} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}