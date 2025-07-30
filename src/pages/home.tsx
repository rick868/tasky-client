import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Paper,
  List as MuiList,
  Chip,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Inbox as InboxIcon,
  Today as TodayIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import { AuthContext } from '../context/AuthContext';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../services/api';

const drawerWidth = 240;

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useContext(AuthContext)!;

  
  const {
    tasks,
    loading,
    fetchTasks,
    createTask,
    markComplete,
    markIncomplete,
    restoreTaskAsync,
    deleteTaskAsync,
  } = useTaskStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('My Tasks');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState(''); 
  const [filterDate, setFilterDate] = useState(''); 
  const [filterPriority, setFilterPriority] = useState(''); 
  const [filterProject, setFilterProject] = useState('');
  const [filterLabel, setFilterLabel] = useState(''); 



  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewSelect = (view: string) => {
    setSelectedView(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleQuickAddOpen = () => {
    setQuickAddOpen(true);
  };

  const handleQuickAddClose = () => {
    setQuickAddOpen(false);
    setNewTaskName('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskProject('');
    setNewTaskTags('');
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;

    try {
      const taskData = {
        title: newTaskName.trim(),
        description: newTaskDescription.trim() || undefined,
        dueDate: newTaskDueDate || undefined,
        project: newTaskProject.trim() || undefined,
        labels: newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        priority: 'Medium' as const,
      };

      await createTask(taskData);
      showSnackbar('Task created successfully', 'success');
      handleQuickAddClose();
    } catch (error) {
      console.error('Error creating task:', error);
      showSnackbar('Failed to create task', 'error');
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTaskAsync(taskToDelete.id);
      showSnackbar('Task deleted successfully', 'success');
      setTaskToDelete(null);
      setConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      showSnackbar('Failed to delete task', 'error');
    }
  };

  const handleRestoreTask = async (taskId: string) => {
    try {
      await restoreTaskAsync(taskId);
      showSnackbar('Task restored successfully', 'success');
    } catch (error) {
      console.error('Error restoring task:', error);
      showSnackbar('Failed to restore task', 'error');
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (task.isCompleted) {
        await markIncomplete(taskId);
        showSnackbar('Task marked incomplete', 'success');
      } else {
        await markComplete(taskId);
        showSnackbar('Task completed', 'success');
        setSelectedView('Completed');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showSnackbar('Failed to update task', 'error');
    }
  };

  const handleApplyFilters = () => {
    setFilterOpen(false); 
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterDate('');
    setFilterPriority('');
    setFilterProject('');
    setFilterLabel('');
    setFilterOpen(false);
  };

  const sidebarItems = [
    { label: 'My Tasks', icon: <CheckCircleIcon />, description: 'Your active tasks', key: 'My Tasks' },
    { label: 'Inbox', icon: <InboxIcon />, description: 'All tasks (upcoming, completed, and current)', key: 'Inbox' },
    { label: 'Today', icon: <TodayIcon />, description: 'Tasks due today', key: 'Today' },
    { label: 'Upcoming', icon: <CalendarTodayIcon />, description: 'Tasks due soon', key: 'Upcoming' },
    { label: 'Completed', icon: <CheckIcon />, description: 'Finished tasks', key: 'Completed' },
    { label: 'Trash', icon: <DeleteIcon />, description: 'Deleted tasks', key: 'Trash' },
  ];

  const renderTaskList = () => {
    let filteredTasks = tasks.filter((task: Task) => !task.isDeleted); 

    if (filterName) {
      filteredTasks = filteredTasks.filter((task: Task) => 
        task.title.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      filteredTasks = filteredTasks.filter((task: Task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === new Date(filterDate).toDateString();
      });
    }

    if (filterPriority) {
      filteredTasks = filteredTasks.filter((task: Task) => task.priority === filterPriority);
    }

    if (filterProject) {
      filteredTasks = filteredTasks.filter((task: Task) => task.project && task.project.trim() && task.project === filterProject);
    }

    if (filterLabel) {
      filteredTasks = filteredTasks.filter((task: Task) => task.labels.includes(filterLabel));
    }

    if (selectedView === 'My Tasks') {
      filteredTasks = filteredTasks.filter((task: Task) => !task.isCompleted);
    } else if (selectedView === 'Completed') {
      filteredTasks = tasks.filter((task: Task) => task.isCompleted && !task.isDeleted);
    } else if (selectedView === 'Inbox') {
      filteredTasks = tasks.filter((task: Task) => !task.isDeleted);
    } else if (selectedView === 'Today') {
      const today = new Date();
      filteredTasks = filteredTasks.filter((task: Task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      });
    } else if (selectedView === 'Upcoming') {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      filteredTasks = filteredTasks.filter((task: Task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= nextWeek && !task.isCompleted;
      });
    } else if (selectedView === 'Trash') {
      filteredTasks = tasks.filter((task: Task) => task.isDeleted);
    }

    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6">Loading tasks...</Typography>
        </Box>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 8, color: theme.palette.text.secondary }}>
          <Typography variant="h6" gutterBottom>
            {selectedView === 'My Tasks' && "You're all caught up! No active tasks."}
            {selectedView === 'Completed' && "No tasks completed yet."}
            {selectedView === 'Today' && "Nothing due today. Enjoy the calm!"}
            {selectedView === 'Upcoming' && "No upcoming tasks for the next 7 days."}
            {selectedView === 'Trash' && "Your trash is empty."}
            {selectedView === 'Inbox' && "Your inbox is clear. Time to add some tasks!"}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            {selectedView === 'My Tasks' && "Ready to add a new task, or take a well-deserved break?"}
            {selectedView === 'Completed' && "Start completing tasks to see them here!"}
            {selectedView === 'Today' && "Planning to add something for today?"}
            {selectedView === 'Upcoming' && "Add new tasks to see your future workload."}
            {selectedView === 'Trash' && "Items in Trash are permanently deleted after 30 days."}
            {selectedView === 'Inbox' && "Let's get productive! Click below to add your first task."}
          </Typography>
          {selectedView !== 'Trash' && (
            <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={handleQuickAddOpen}>
              + Add {selectedView === 'Inbox' || selectedView === 'My Tasks' ? 'New' : 'Your First'} Task
            </Button>
          )}
          {selectedView === 'My Tasks' && (
            <Button variant="text" sx={{ mt: 2 }} onClick={() => handleViewSelect('Completed')}>
              Explore your completed tasks
            </Button>
          )}
        </Box>
      );
    }

    return (
      <MuiList sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
        {filteredTasks.map((task: Task) => {
          let priorityColor: 'error' | 'warning' | 'info';
          if (task.priority === 'High') {
            priorityColor = 'error';
          } else if (task.priority === 'Medium') {
            priorityColor = 'warning';
          } else {
            priorityColor = 'info';
          }

          return (
            <Paper key={task.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
              <ListItem sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, pr: 2 }}>
                  {selectedView !== 'Completed' && selectedView !== 'Trash' && (
                    <IconButton
                      edge="start"
                      color="primary"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{ mr: 1, p: 0 }}
                    >
                      {task.isCompleted ? <CheckCircleIcon color="success" /> : <div style={{ width: 24, height: 24, border: '1px solid gray', borderRadius: '50%' }}></div>}
                    </IconButton>
                  )}
                  {selectedView === 'Completed' && (
                    <IconButton
                      edge="start"
                      color="success"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{ mr: 1, p: 0 }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}

                  <ListItemText
                    primary={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                        color: task.isCompleted ? theme.palette.text.disabled : 'inherit',
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {task.title}
                        </Typography>
                        {task.priority && (
                          <Chip label={task.priority} color={priorityColor} size="small" />
                        )}
                        {task.dueDate && (
                          <Chip
                            label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                            size="small"
                            icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                            color={new Date(task.dueDate) < new Date() && !task.isCompleted ? 'error' : 'default'}
                          />
                        )}
                        {task.project && task.project.trim() && (
                          <Chip label={`#${task.project}`} size="small" variant="outlined" />
                        )}
                        {task.labels?.map(label => (
                          <Chip key={label} label={label ? `@${label}` : undefined} size="small" variant="outlined" />
                        ))}
                      </Box>
                    }
                    secondary={task.description}
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Box>
                  {selectedView === 'Trash' ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleRestoreTask(task.id)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(task)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </ListItem>
            </Paper>
          );
        })}
      </MuiList>
    );
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', marginTop: '2rem' }}>
      <List sx={{ pt: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selectedView === item.key}
              onClick={() => handleViewSelect(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon sx={{ color: selectedView === item.key ? theme.palette.primary.contrastText : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.description} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const allProjects = [...new Set(tasks.map((task: Task) => task.project).filter((project): project is string => Boolean(project)))];
  const allLabels = [...new Set(tasks.flatMap((task: Task) => task.labels || []).filter(Boolean))];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: theme.palette.background.default }}>
     
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Tasky
          </Typography>

          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleQuickAddOpen}
            sx={{
              ml: 2,
              display: { xs: 'none', sm: 'flex' },
              borderRadius: theme.shape.borderRadius,
            }}
          >
            Add Task
          </Button>

         
          <IconButton
            color="inherit"
            aria-label="add task"
            onClick={handleQuickAddOpen}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <AddIcon />
          </IconButton>

          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.light }}>
              {user?.userName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {selectedView}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setFilterOpen(true)}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Filter
          </Button>
        </Box>

        {renderTaskList()}

        {/* Quick Add Modal */}
        <Modal
          open={quickAddOpen}
          onClose={handleQuickAddClose}
          aria-labelledby="quick-add-modal"
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 450 },
              p: 4,
              borderRadius: typeof theme.shape.borderRadius === 'number'
                ? theme.shape.borderRadius * 2
                : `calc(${theme.shape.borderRadius} * 2)`,
              boxShadow: theme.shadows[8],
              outline: 'none',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
              Quick Add Task
            </Typography>
            <TextField
              label="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              autoFocus
            />
            <TextField
              label="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
            />
            <TextField
              label="Due Date (optional)"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Project (optional)"
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Tags (comma-separated, optional)"
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="work, urgent, personal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button variant="outlined" onClick={handleQuickAddClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddTask}>
                Add Task
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal
          open={confirmDeleteOpen}
          onClose={handleCancelDelete}
          aria-labelledby="confirm-delete-modal"
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              p: 4,
              borderRadius: typeof theme.shape.borderRadius === 'number'
                ? theme.shape.borderRadius * 2
                : `calc(${theme.shape.borderRadius} * 2)`,
              boxShadow: theme.shadows[8],
              outline: 'none',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: theme.palette.error.main }}>
              Confirm Delete
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Filter Modal */}
        <Modal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          aria-labelledby="filter-modal"
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 450 },
              p: 4,
              borderRadius: typeof theme.shape.borderRadius === 'number'
                ? theme.shape.borderRadius * 2
                : `calc(${theme.shape.borderRadius} * 2)`,
              boxShadow: theme.shadows[8],
              outline: 'none',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
              Filter Tasks
            </Typography>
            <TextField
              label="Filter by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Filter by Due Date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Filter by Priority</InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Filter by Priority"
              >
                <SelectMenuItem value=""><em>Any</em></SelectMenuItem>
                <SelectMenuItem value="High">High</SelectMenuItem>
                <SelectMenuItem value="Medium">Medium</SelectMenuItem>
                <SelectMenuItem value="Low">Low</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Filter by Project</InputLabel>
              <Select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                label="Filter by Project"
              >
                <SelectMenuItem value=""><em>Any</em></SelectMenuItem>
                {allProjects.map(project => (
                  <SelectMenuItem key={String(project)} value={String(project)}>{String(project)}</SelectMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Filter by Label</InputLabel>
              <Select
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
                label="Filter by Label"
              >
                <SelectMenuItem value=""><em>Any</em></SelectMenuItem>
                {allLabels.map(label => (
                  <SelectMenuItem key={String(label)} value={String(label)}>{String(label)}</SelectMenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </Box>
          </Paper>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </Box>
  );
};

export default Home;