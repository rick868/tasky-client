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
    softDeleteTask,
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
      
      await softDeleteTask(taskToDelete.id);
      showSnackbar('Task moved to trash', 'success');
      setTaskToDelete(null);
      setConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error moving task to trash:', error);
      showSnackbar('Failed to move task to trash', 'error');
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
          <Typography variant="h6" color="text.secondary">Loading tasks...</Typography>
        </Box>
      );
    }

    if (filteredTasks.length === 0) {
      const emptyStateConfig = {
        'My Tasks': {
          title: "You're all caught up! 🎉",
          subtitle: "No active tasks. Ready to add a new task, or take a well-deserved break?",
          buttonText: "+ Add New Task",
        },
        'Completed': {
          title: "No tasks completed yet",
          subtitle: "Start completing tasks to see them here!",
          buttonText: "+ Add Your First Task",
        },
        'Today': {
          title: "Nothing due today. Enjoy the calm! ☀️",
          subtitle: "Planning to add something for today?",
          buttonText: "+ Add Task for Today",
        },
        'Upcoming': {
          title: "No upcoming tasks for the next 7 days",
          subtitle: "Add new tasks to see your future workload.",
          buttonText: "+ Add Upcoming Task",
        },
        'Trash': {
          title: "Your trash is empty",
          subtitle: "Items in Trash are permanently deleted after 30 days.",
          buttonText: null,
        },
        'Inbox': {
          title: "Your inbox is clear! ✨",
          subtitle: "Let's get productive! Click below to add your first task.",
          buttonText: "+ Add Your First Task",
        },
      };

      const config = emptyStateConfig[selectedView as keyof typeof emptyStateConfig] || emptyStateConfig['My Tasks'];

      return (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 8, 
          mb: 4,
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `2px dashed ${theme.palette.divider}`,
        }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            {config.title}
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            {config.subtitle}
          </Typography>
          {config.buttonText && (
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<AddIcon />} 
              onClick={handleQuickAddOpen}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                  boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {config.buttonText}
            </Button>
          )}
          {selectedView === 'My Tasks' && (
            <Button 
              variant="text" 
              sx={{ 
                mt: 2,
                textTransform: 'none',
                fontWeight: 500,
              }} 
              onClick={() => navigate('/completedTasks')}
            >
              Explore your completed tasks →
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
            <Paper 
              key={task.id} 
              elevation={task.isCompleted ? 1 : 3} 
              sx={{ 
                mb: 2, 
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                opacity: task.isCompleted ? 0.7 : 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6],
                  opacity: 1,
                },
                border: task.isCompleted ? `1px solid ${theme.palette.divider}` : '1px solid transparent',
              }}
            >
              <ListItem sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                p: 2.5,
                bgcolor: task.isCompleted ? 'rgba(0, 0, 0, 0.02)' : 'background.paper',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1, pr: 2, gap: 1.5 }}>
                  {selectedView !== 'Completed' && selectedView !== 'Trash' && (
                    <IconButton
                      edge="start"
                      color="primary"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{ 
                        mt: 0.5,
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {task.isCompleted ? (
                        <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
                      ) : (
                        <Box 
                          sx={{ 
                            width: 28, 
                            height: 28, 
                            border: `2px solid ${theme.palette.primary.main}`, 
                            borderRadius: '50%',
                            transition: 'all 0.2s ease',
                          }}
                        />
                      )}
                    </IconButton>
                  )}
                  {selectedView === 'Completed' && (
                    <IconButton
                      edge="start"
                      color="success"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{ 
                        mt: 0.5,
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: 'success.light',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                  )}

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 0.5,
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          textDecoration: task.isCompleted ? 'line-through' : 'none',
                          color: task.isCompleted ? theme.palette.text.disabled : 'text.primary',
                          wordBreak: 'break-word',
                        }}
                      >
                        {task.title}
                      </Typography>
                      {task.priority && (
                        <Chip 
                          label={task.priority} 
                          color={priorityColor} 
                          size="small"
                          sx={{
                            fontWeight: 600,
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1.5,
                            },
                          }}
                        />
                      )}
                      {task.dueDate && (
                        <Chip
                          label={new Date(task.dueDate).toLocaleDateString()}
                          size="small"
                          icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                          color={new Date(task.dueDate) < new Date() && !task.isCompleted ? 'error' : 'default'}
                          variant={new Date(task.dueDate) < new Date() && !task.isCompleted ? 'filled' : 'outlined'}
                          sx={{
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1.5,
                            },
                          }}
                        />
                      )}
                    </Box>
                    {task.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textDecoration: task.isCompleted ? 'line-through' : 'none',
                          wordBreak: 'break-word',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                      {task.project && task.project.trim() && (
                        <Chip 
                          label={task.project} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            height: 22,
                            bgcolor: 'primary.light',
                            borderColor: 'primary.main',
                            color: 'primary.dark',
                            fontWeight: 500,
                          }}
                        />
                      )}
                      {task.labels?.map(label => (
                        label && (
                          <Chip 
                            key={label} 
                            label={label} 
                            size="small" 
                            variant="outlined"
                            sx={{
                              height: 22,
                              borderColor: 'secondary.main',
                              color: 'secondary.dark',
                              fontWeight: 500,
                            }}
                          />
                        )
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  {selectedView === 'Trash' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleRestoreTask(task.id)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        fontWeight: 600,
                      }}
                    >
                      Restore
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/updateTask/${task.id}`)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 2,
                          display: { xs: 'none', sm: 'inline-flex' },
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(task)}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'error.dark',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
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
    <Box sx={{ overflow: 'auto', marginTop: '4rem' }}>
      <List sx={{ pt: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selectedView === item.key}
              onClick={() => handleViewSelect(item.key)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                  }
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 2,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedView === item.key ? 'white' : 'inherit',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: selectedView === item.key ? 600 : 500,
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                }}
              />
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
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '1.5rem',
              '&:hover': {
                opacity: 0.9,
              },
            }}
            onClick={() => navigate('/home')}
          >
            Tasky
          </Typography>

          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleQuickAddOpen}
            sx={{
              ml: 2,
              display: { xs: 'none', sm: 'flex' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Task
          </Button>

         
          <IconButton
            color="inherit"
            aria-label="add task"
            onClick={handleQuickAddOpen}
            sx={{ 
              display: { xs: 'block', sm: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <AddIcon />
          </IconButton>

          <IconButton 
            color="inherit" 
            sx={{ 
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
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
            sx={{ 
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Avatar sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}>
              {user?.userName?.charAt(0).toUpperCase() || 'U'}
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
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
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
          marginLeft: { sm: `${drawerWidth}px` },
          mt: 8,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {selectedView}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setFilterOpen(true)}
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
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
              width: { xs: '90%', sm: 500 },
              p: 4,
              borderRadius: 3,
              boxShadow: theme.shadows[12],
              outline: 'none',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Project (optional)"
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Tags (comma-separated, optional)"
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="work, urgent, personal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleQuickAddClose}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleAddTask}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                  },
                }}
              >
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
              width: { xs: '90%', sm: 450 },
              p: 4,
              borderRadius: 3,
              boxShadow: theme.shadows[12],
              outline: 'none',
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: 'warning.main',
              }}
            >
              Move to Trash
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Are you sure you want to move <strong>"{taskToDelete?.title}"</strong> to trash? This action can be undone from the Trash view.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancelDelete}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={handleConfirmDelete}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Move to Trash
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
              width: { xs: '90%', sm: 500 },
              p: 4,
              borderRadius: 3,
              boxShadow: theme.shadows[12],
              outline: 'none',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Filter Tasks
            </Typography>
            <TextField
              label="Filter by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Clear Filters
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                  },
                }}
              >
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