import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme, 
  alpha,
  Skeleton,
  Zoom,
  useMediaQuery,
  Stack
} from '@mui/material';

import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const TaskStatCards = ({ loading, stats, pageLoaded }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <TaskIcon />,
      color: theme.palette.primary.main,
      delay: '100ms',
      gradient: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
      delay: '200ms',
      gradient: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <PendingIcon />,
      color: theme.palette.warning.main,
      delay: '300ms',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Desktop/Tablet View - Single Row */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        sx={{ 
          width: '100%',
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        {statCards.map((card, index) => (
          <Box 
            key={index} 
            sx={{ 
              flex: 1,
              minWidth: 0, 
            }}
          >
            <Zoom in={pageLoaded} style={{ transitionDelay: pageLoaded ? card.delay : '0ms' }}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  height: '100%',
                  width: '100%',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: theme.palette.mode === 'dark' 
                    ? alpha(card.color, 0.1)
                    : '#fff',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                  },
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Decorative gradient overlay */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    borderRadius: '0 0 0 100%',
                    opacity: 0.05,
                    background: card.gradient
                  }}
                />
                
                <CardContent sx={{ p: 2.5, position: 'relative' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: alpha(card.color, 0.1),
                        color: card.color,
                        mr: 2
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      {loading ? (
                        <Skeleton width={60} height={40} />
                      ) : (
                        <Typography variant="h4" fontWeight="bold" color={card.color}>
                          {card.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      mt: 1.5,
                      pt: 1.5,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        card.title === 'Total Tasks' 
                          ? `${stats.completed} completed, ${stats.pending} pending`
                          : card.title === 'Completed'
                            ? `${Math.round((stats.completed / (stats.total || 1)) * 100)}% of total tasks`
                            : `${Math.round((stats.pending / (stats.total || 1)) * 100)}% of total tasks`
                      )}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Box>
        ))}
      </Stack>

      {/* Mobile View - Full Width Stack */}
      <Stack 
        direction="column"
        spacing={2}
        sx={{ 
          width: '100%', 
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        {statCards.map((card, index) => (
          <Zoom 
            key={`mobile-${index}`} 
            in={pageLoaded} 
            style={{ transitionDelay: pageLoaded ? card.delay : '0ms' }}
          >
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                width: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                background: theme.palette.mode === 'dark' 
                  ? alpha(card.color, 0.1)
                  : '#fff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                },
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Decorative gradient overlay */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  borderRadius: '0 0 0 100%',
                  opacity: 0.05,
                  background: card.gradient
                }}
              />
              
              <CardContent sx={{ p: 2.5, position: 'relative' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: alpha(card.color, 0.1),
                        color: card.color,
                        mr: 2
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      {loading ? (
                        <Skeleton width={60} height={40} />
                      ) : (
                        <Typography variant="h4" fontWeight="bold" color={card.color}>
                          {card.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Additional info on the right for mobile */}
                  {!loading && (
                    <Box 
                      sx={{ 
                        bgcolor: alpha(card.color, 0.1),
                        color: card.color,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" fontWeight="medium">
                        {card.title === 'Total Tasks' 
                          ? `${Math.round((stats.completed / (stats.total || 1)) * 100)}%`
                          : card.title === 'Completed'
                            ? `${Math.round((stats.completed / (stats.total || 1)) * 100)}%`
                            : `${Math.round((stats.pending / (stats.total || 1)) * 100)}%`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        ))}
      </Stack>
    </Box>
  );
};

export default TaskStatCards;