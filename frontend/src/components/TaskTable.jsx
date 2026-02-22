import { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  useTheme, 
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';
import axios from 'axios';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TaskTable({ tasks, onView, onEdit, onDelete, onMarkAsDone, isLoading }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
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

  const getStatusColor = (completed) => {
    return completed ? theme.palette.success.main : theme.palette.warning.main;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle mark as done
  const handleMarkAsDone = async (task) => {
    try {
      setUpdatingTaskId(task._id);
      handleMenuClose();
      
      // Mark as done
      const updatedTask = await onMarkAsDone(task._id);
      if (!updatedTask) {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error marking task as done:', error);
    } finally {
      setUpdatingTaskId(null);
    }
  };
  
  const handleView = () => {
    onView && onView(selectedTask);
    handleMenuClose();
  };
  
  const handleEdit = () => {
    onEdit && onEdit(selectedTask);
    handleMenuClose();
  };
  
  const handleDelete = () => {
    onDelete && onDelete(selectedTask);
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.primary.main, 0.02),
                }}
              >
                Task
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.primary.main, 0.02),
                }}
              >
                Due Date
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.primary.main, 0.02),
                }}
              >
                Priority
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.primary.main, 0.02),
                }}
              >
                Status
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.primary.main, 0.02),
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task) => (
                <TableRow
                  key={task._id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.04) 
                    },
                    // Add a subtle background for completed tasks
                    ...(task.completed && {
                      backgroundColor: alpha(theme.palette.success.main, 0.03),
                    })
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography 
                        variant="body1" 
                        fontWeight="500"
                        sx={{
                          // Add strikethrough for completed tasks
                          ...(task.completed && {
                            textDecoration: 'line-through',
                            color: alpha(theme.palette.text.primary, 0.7),
                          })
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '400px',
                          // Add strikethrough for completed tasks
                          ...(task.completed && {
                            textDecoration: 'line-through',
                            color: alpha(theme.palette.text.secondary, 0.7),
                          })
                        }}
                      >
                        {task.description}
                      </Typography>
                      {task.completed && task.onTime !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            icon={<AccessTimeIcon fontSize="small" />}
                            label={task.onTime ? "Completed on time" : "Completed late"}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: task.onTime 
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.error.main, 0.1),
                              color: task.onTime
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(task.dueDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getPriorityColor(task.priority), 0.1),
                        color: getPriorityColor(task.priority),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={task.completed ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
                      label={task.completed ? 'Completed' : 'Pending'} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getStatusColor(task.completed), 0.1),
                        color: getStatusColor(task.completed),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {updatingTaskId === task._id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, task)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tasks found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {selectedTask && (
          <MenuItem 
            onClick={() => !selectedTask.completed && handleMarkAsDone(selectedTask)}
            disabled={selectedTask.completed}
            sx={{
              opacity: selectedTask.completed ? 0.5 : 1,
              '&.Mui-disabled': {
                opacity: 0.5,
              }
            }}
          >
            <ListItemIcon>
              <DoneIcon 
                fontSize="small" 
                color={selectedTask.completed ? "disabled" : "success"} 
              />
            </ListItemIcon>
            <ListItemText>
              Mark as Done
            </ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}