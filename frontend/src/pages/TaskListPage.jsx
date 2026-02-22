import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

export default function TasksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [completedFilter, setCompletedFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Sort menu
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");

  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setNotification({
        open: true,
        message: "Failed to load tasks. Please try again.",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  // Simulate page load for animation and fetch tasks
  useEffect(() => {
    setPageLoaded(true);
    fetchTasks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...tasks];

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply completed filter
    if (completedFilter !== "all") {
      const isCompleted = completedFilter === "completed";
      result = result.filter((task) => task.completed === isCompleted);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(
        (task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Apply date filter
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (dateFilter === "today") {
      result = result.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      });
    } else if (dateFilter === "tomorrow") {
      result = result.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === tomorrow.toDateString();
      });
    } else if (dateFilter === "week") {
      result = result.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityOrder[a.priority.toLowerCase()] || 0;
        const priorityB = priorityOrder[b.priority.toLowerCase()] || 0;
        return sortDirection === "asc"
          ? priorityA - priorityB
          : priorityB - priorityA;
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "completed") {
        // Sort by completion status
        return sortDirection === "asc"
          ? (a.completed ? 1 : 0) - (b.completed ? 1 : 0)
          : (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
      } else if (sortBy === "onTime") {
        // Sort by onTime status (null values last)
        const onTimeA = a.onTime === null ? -1 : a.onTime ? 1 : 0;
        const onTimeB = b.onTime === null ? -1 : b.onTime ? 1 : 0;
        return sortDirection === "asc"
          ? onTimeA - onTimeB
          : onTimeB - onTimeA;
      }
      return 0;
    });

    setFilteredTasks(result);
  }, [
    tasks,
    searchQuery,
    completedFilter,
    priorityFilter,
    dateFilter,
    sortBy,
    sortDirection,
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    handleSortClose();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCompletedFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
    setSortBy("dueDate");
    setSortDirection("asc");
  };

  // Task CRUD operations
  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(`/api/tasks/${taskToDelete._id}`);

      // Update local state
      const updatedTasks = tasks.filter((t) => t._id !== taskToDelete._id);
      setTasks(updatedTasks);

      // Show success notification
      setNotification({
        open: true,
        message: "Task deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      setNotification({
        open: true,
        message: "Failed to delete task. Please try again.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (modalMode === "create") {
        // Create new task
        const response = await axios.post("/api/tasks", taskData);
        setTasks([...tasks, response.data]);

        setNotification({
          open: true,
          message: "Task created successfully",
          severity: "success",
        });
      } else if (modalMode === "edit") {
        // Update existing task
        const response = await axios.put(`/api/tasks/${taskData._id}`, taskData);

        const updatedTasks = tasks.map((task) =>
          task._id === response.data._id ? response.data : task
        );
        setTasks(updatedTasks);

        setNotification({
          open: true,
          message: "Task updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      setNotification({
        open: true,
        message: `Failed to ${modalMode === "create" ? "create" : "update"} task. Please try again.`,
        severity: "error",
      });
    } finally {
      setModalOpen(false);
    }
  };

  // Handle task completion update (mark as done)
  const handleMarkAsDone = async (taskId) => {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}/done`);
      
      // Update local state
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? response.data : task
      );
      setTasks(updatedTasks);

      // Show notification
      setNotification({
        open: true,
        message: "Task marked as completed",
        severity: "success",
      });

      // Return the updated task for any component that needs it
      return response.data;
    } catch (error) {
      console.error("Error marking task as done:", error);
      setNotification({
        open: true,
        message: "Failed to mark task as done. Please try again.",
        severity: "error",
      });
      return null;
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "linear-gradient(to right, #f5f7fa, #f8f9fa)",
      }}
    >
      <Sidebar />
      <Box
        component="main"
        flex={1}
        sx={{
          overflowY: "auto",
          transition: "all 0.3s ease",
          px: isMobile ? 0 : 1, 
          ml: isMobile ? -4 : 1, 
          pt: isMobile ? 9 : 1, 
          pb: 3,
        }}
      >
        <Helmet>
          <title>Tasks | Task Manager</title>
        </Helmet>

        <Fade in={pageLoaded} timeout={800}>
          <Box sx={{ 
            maxWidth: isMobile ? '100%' : 'auto',
            mx: isMobile ? 'auto' : 0, // Center horizontally on mobile
            px: isMobile ? 2 : 0, // Add some horizontal padding inside the box on mobile
          }}>
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 2,
                background:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: 20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <CardContent
                sx={{ py: 4, px: 3, position: "relative", zIndex: 1 }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  My Tasks
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.8, maxWidth: isMobile ? "100%" : "60%" }}
                >
                  Manage your tasks efficiently. Create, edit, and track your
                  progress all in one place.
                </Typography>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Zoom
              in={pageLoaded}
              style={{ transitionDelay: pageLoaded ? "200ms" : "0ms" }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  mb: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <TextField
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{ flexGrow: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                      }}
                    />

                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                      justifyContent: isMobile ? 'space-between' : 'flex-end',
                      width: isMobile ? '100%' : 'auto',
                      mt: isMobile ? 1 : 0
                    }}>
                      <Box>
                        <Tooltip title="Filter">
                          <IconButton
                            onClick={() => setShowFilters(!showFilters)}
                            color={showFilters ? "primary" : "default"}
                          >
                            <FilterListIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Sort">
                          <IconButton onClick={handleSortClick}>
                            <SortIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Reset Filters">
                          <IconButton onClick={resetFilters}>
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTask}
                        sx={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
                          px: 2,
                          py: 1,
                          ml: isMobile ? 0 : 1,
                          textTransform: "none",
                          fontWeight: "bold",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        Add New Task
                      </Button>
                    </Box>
                  </Box>

                  <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={handleSortClose}
                  >
                    <MenuItem
                      onClick={() => handleSortSelect("dueDate")}
                      selected={sortBy === "dueDate"}
                    >
                      Due Date {sortBy === "dueDate" && (sortDirection === "asc" ? "↑" : "↓")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortSelect("priority")}
                      selected={sortBy === "priority"}
                    >
                      Priority {sortBy === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortSelect("title")}
                      selected={sortBy === "title"}
                    >
                      Title {sortBy === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortSelect("completed")}
                      selected={sortBy === "completed"}
                    >
                      Completion {sortBy === "completed" && (sortDirection === "asc" ? "↑" : "↓")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSortSelect("onTime")}
                      selected={sortBy === "onTime"}
                    >
                      On Time {sortBy === "onTime" && (sortDirection === "asc" ? "↑" : "↓")}
                    </MenuItem>
                  </Menu>

                  {showFilters && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 2, opacity: 0.1 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={completedFilter}
                              onChange={(e) => setCompletedFilter(e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="all">All Tasks</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Priority</InputLabel>
                            <Select
                              value={priorityFilter}
                              onChange={(e) =>
                                setPriorityFilter(e.target.value)
                              }
                              label="Priority"
                            >
                              <MenuItem value="all">All Priorities</MenuItem>
                              <MenuItem value="low">Low</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="high">High</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Due Date</InputLabel>
                            <Select
                              value={dateFilter}
                              onChange={(e) => setDateFilter(e.target.value)}
                              label="Due Date"
                            >
                              <MenuItem value="all">All Dates</MenuItem>
                              <MenuItem value="today">Today</MenuItem>
                              <MenuItem value="tomorrow">Tomorrow</MenuItem>
                              <MenuItem value="week">Next 7 Days</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {completedFilter !== "all" && (
                          <Chip
                            label={`Status: ${completedFilter}`}
                            onDelete={() => setCompletedFilter("all")}
                            size="small"
                          />
                        )}

                        {priorityFilter !== "all" && (
                          <Chip
                            label={`Priority: ${priorityFilter}`}
                            onDelete={() => setPriorityFilter("all")}
                            size="small"
                          />
                        )}

                        {dateFilter !== "all" && (
                          <Chip
                            label={`Date: ${
                              dateFilter === "today"
                                ? "Today"
                                : dateFilter === "tomorrow"
                                ? "Tomorrow"
                                : "Next 7 Days"
                            }`}
                            onDelete={() => setDateFilter("all")}
                            size="small"
                          />
                        )}

                        {(completedFilter !== "all" ||
                          priorityFilter !== "all" ||
                          dateFilter !== "all") && (
                          <Chip
                            label="Clear All"
                            onDelete={resetFilters}
                            deleteIcon={<CloseIcon />}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>

            {/* Task Stats */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  flex: '1 1 200px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {tasks.length}
                  </Typography>
                </CardContent>
              </Card>
              
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  flex: '1 1 200px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {tasks.filter(task => task.completed).length}
                  </Typography>
                </CardContent>
              </Card>
              
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  flex: '1 1 200px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {tasks.filter(task => !task.completed).length}
                  </Typography>
                </CardContent>
              </Card>
              
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  flex: '1 1 200px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed On Time
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {tasks.filter(task => task.completed && task.onTime).length}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Task Count */}
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 1 : 0,
                alignItems: isMobile ? "flex-start" : "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </Typography>

              {sortBy && (
                <Typography variant="body2" color="text.secondary">
                  Sorted by:{" "}
                  {sortBy === "dueDate"
                    ? "Due Date"
                    : sortBy === "priority"
                    ? "Priority"
                    : sortBy === "completed"
                    ? "Completion"
                    : sortBy === "onTime"
                    ? "On Time"
                    : "Title"}{" "}
                  ({sortDirection === "asc" ? "ascending" : "descending"})
                </Typography>
              )}
            </Box>

            {/* Tasks Table */}
            <Zoom
              in={pageLoaded}
              style={{ transitionDelay: pageLoaded ? "400ms" : "0ms" }}
            >
              <Box>
                <TaskTable
                  tasks={filteredTasks}
                  onView={handleViewTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteClick}
                  onMarkAsDone={handleMarkAsDone}
                  isLoading={isLoading}
                />

                {!isLoading && filteredTasks.length === 0 && (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      mt: 2,
                      p: 4,
                      textAlign: "center",
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No tasks found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filter criteria
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={resetFilters}
                      sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                    >
                      Reset Filters
                    </Button>
                  </Card>
                )}
              </Box>
            </Zoom>
          </Box>
        </Fade>

        {/* Task Modal */}
        <TaskModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          task={selectedTask}
          mode={modalMode}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ 
              width: "100%",
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}