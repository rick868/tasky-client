import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  useTheme,
  AppBar,
  Toolbar,
  Drawer,
  List as MuiList,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Inbox as InboxIcon,
  Today as TodayIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../services/api';

const drawerWidth = 240;

const CompletedTasks = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { tasks, markIncomplete } = useTaskStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewSelect = (view: string) => {
    if (view === 'My Tasks') {
      navigate('/home');
    } else if (view === 'Completed') {
      // Already on completed page
    } else if (view === 'Inbox') {
      navigate('/home');
    } else if (view === 'Today') {
      navigate('/home');
    } else if (view === 'Upcoming') {
      navigate('/home');
    } else if (view === 'Trash') {
      navigate('/trash');
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await markIncomplete(taskId);
    } catch (error) {
      console.error('Error marking task incomplete:', error);
    }
  };

  const sidebarItems = [
    { label: 'My Tasks', icon: <CheckCircleIcon />, description: 'Your active tasks', key: 'My Tasks' },
    { label: 'Inbox', icon: <InboxIcon />, description: 'All tasks (upcoming, completed, and current)', key: 'Inbox' },
    { label: 'Today', icon: <TodayIcon />, description: 'Tasks due today', key: 'Today' },
    { label: 'Upcoming', icon: <CalendarTodayIcon />, description: 'Tasks due soon', key: 'Upcoming' },
    { label: 'Completed', icon: <CheckIcon />, description: 'Finished tasks', key: 'Completed' },
    { label: 'Trash', icon: <DeleteIcon />, description: 'Deleted tasks', key: 'Trash' },
  ];

  // Filter for completed tasks only
  const completedTasks = tasks.filter((task: Task) => task.isCompleted && !task.isDeleted);

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <MuiList sx={{ pt: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={item.key === 'Completed'}
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
              <ListItemIcon sx={{ color: item.key === 'Completed' ? theme.palette.primary.contrastText : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.description} />
            </ListItemButton>
          </ListItem>
        ))}
      </MuiList>
    </Box>
  );

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
          <IconButton
            color="inherit"
            onClick={() => navigate('/home')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Completed Tasks
          </Typography>
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
          marginLeft: { sm: `${drawerWidth}px` },
          mt: 8,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Completed Tasks
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
          >
            Back to Tasks
          </Button>
        </Box>

        {completedTasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, color: theme.palette.text.secondary }}>
            <Typography variant="h6" gutterBottom>
              No completed tasks yet.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Start completing tasks to see them here!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/home')}>
              Go to My Tasks
            </Button>
          </Box>
        ) : (
          <List sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
            {completedTasks.map((task: Task) => {
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
                      <IconButton
                        edge="start"
                        color="success"
                        onClick={() => handleToggleComplete(task.id)}
                        sx={{ mr: 1, p: 0 }}
                      >
                        <CheckCircleIcon />
                      </IconButton>

                      <ListItemText
                        primary={
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            textDecoration: 'line-through',
                            color: theme.palette.text.disabled,
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
                                color="default"
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
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleToggleComplete(task.id)}
                      >
                        Mark Incomplete
                      </Button>
                    </Box>
                  </ListItem>
                </Paper>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default CompletedTasks;