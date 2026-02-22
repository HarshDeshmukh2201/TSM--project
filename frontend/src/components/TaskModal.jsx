import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
  alpha,
  Slide,
  Divider,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TaskModal({ open, onClose, onSubmit, task, mode = "create" }) {
  const theme = useTheme();
  const isView = mode === "view";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: new Date().toISOString().split('T')[0], 
    completed: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        completed: task.completed || false
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      onSubmit && onSubmit(formData);
    } else {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Task";
      case "edit":
        return "Edit Task";
      case "view":
        return "Task Details";
      default:
        return "Task";
    }
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" fontWeight="bold">
          {getModalTitle()}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ opacity: 0.1 }} />
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="title"
            label="Task Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            disabled={isView}
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              sx: {
                borderRadius: 1.5
              }
            }}
          />
          
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={isView}
            variant="outlined"
            error={!!errors.description}
            helperText={errors.description}
            InputProps={{
              sx: {
                borderRadius: 1.5
              }
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl fullWidth disabled={isView} error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
                sx={{ borderRadius: 1.5 }}
                renderValue={(selected) => (
                  <Chip 
                    label={selected} 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(getPriorityColor(selected), 0.1),
                      color: getPriorityColor(selected),
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
              {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              fullWidth
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isView}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: {
                  borderRadius: 1.5
                }
              }}
            />
          </Box>
          
          {(mode === "edit" || mode === "view") && (
            <FormControlLabel
              control={
                <Switch
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  disabled={isView}
                  color="success"
                />
              }
              label="Mark as completed"
            />
          )}
          
          {isView && formData.completed && formData.onTime !== null && (
            <Box sx={{ 
              mt: 1, 
              p: 2, 
              bgcolor: alpha(formData.onTime ? theme.palette.success.main : theme.palette.error.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(formData.onTime ? theme.palette.success.main : theme.palette.error.main, 0.2)}`
            }}>
              <Typography variant="body2" color={formData.onTime ? "success.main" : "error.main"}>
                {formData.onTime 
                  ? "✓ This task was completed on time" 
                  : "⚠ This task was completed after the due date"}
              </Typography>
              {formData.completedAt && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Completed on: {new Date(formData.completedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      {!isView && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitting}
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
              position: 'relative',
              '&:disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.7),
                color: 'white'
              }
            }}
          >
            {isSubmitting ? 'Saving...' : mode === "edit" ? "Update Task" : "Create Task"}
            {isSubmitting && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  height: 3, 
                  bgcolor: alpha(theme.palette.common.white, 0.3),
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.6 }
                  }
                }} 
              />
            )}
          </Button>
        </DialogActions>
      )}
      
      {isView && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3
            }}
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              onEdit && onEdit(formData);
              onClose();
            }} 
            variant="contained"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            }}
          >
            Edit Task
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}