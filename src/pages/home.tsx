import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemText,
  Chip,
  Drawer,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Toolbar,
  AppBar,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Inbox as InboxIcon,
  CalendarToday as CalendarTodayIcon,
  Today as TodayIcon,
  Check as CheckIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface Task {
  id: string;
  title: string;
  dueDate?: string | null;
  priority: 'High' | 'Medium' | 'Low';
  project?: string | null;
  labels: string[];
  status: string;
  isCompleted: boolean;
  isDeleted: boolean;
  description?: string;
}

const tasksSample: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    dueDate: '2025-07-25',
    priority: 'High',
    project: 'Website Launch',
    labels: ['Work', 'Urgent'],
    status: 'Not Started',
    isCompleted: false,
    isDeleted: false,
  },
  {
    id: '2',
    title: 'Write Blog Post',
    dueDate: '2025-07-28',
    priority: 'Medium',
    project: 'Content',
    labels: ['Writing'],
    status: 'In Progress',
    isCompleted: false,
    isDeleted: false,
  },
  {
    id: '3',
    title: 'Review PRD',
    dueDate: '2025-07-19', 
    priority: 'High',
    project: 'Website Launch',
    labels: ['Work'],
    status: 'Not Started',
    isCompleted: false,
    isDeleted: false,
  },
  {
    id: '4',
    title: 'Plan Team Offsite',
    dueDate: '2025-07-22', 
    priority: 'Medium',
    project: 'Team Building',
    labels: ['Event'],
    status: 'Not Started',
    isCompleted: false,
    isDeleted: false,
  },
    {
      id: '5',
      title: 'Submit Expense Report',
      dueDate: '2025-07-10',
      priority: 'High',
      project: 'Admin',
      labels: ['Finance'],
      status: 'Not Started',
      isCompleted: false,
      isDeleted: false,
    }
  ];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedView, setSelectedView] = useState('My Tasks');
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : tasksSample;
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState(''); 
  const [filterDate, setFilterDate] = useState(''); 
  const [filterPriority, setFilterPriority] = useState(''); 
  const [filterProject, setFilterProject] = useState('');
  const [filterLabel, setFilterLabel] = useState(''); 

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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

  const handleQuickAddOpen = () => {
    setQuickAddOpen(true);
  };

  const handleQuickAddClose = () => {
    setQuickAddOpen(false);
    setNewTaskName('');
    setNewTaskDueDate('');
    setNewTaskProject('');
    setNewTaskTags('');
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskName.trim(),
      dueDate: newTaskDueDate || null,
      project: newTaskProject.trim() || null,
      labels: newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      priority: 'Medium',
      status: 'Not Started',
      isCompleted: false,
      isDeleted: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    handleQuickAddClose();
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      let updatedTasks;
      if (selectedView === 'Trash') {
        updatedTasks = tasks.filter((t: Task) => t.id !== taskToDelete.id);
      } else {
        updatedTasks = tasks.map((t: Task) => {
          if (t.id === taskToDelete.id) {
            return { ...t, isDeleted: true };
          }
          return t;
        });
      }

      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTaskToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleRestoreTask = (taskId : string) => {
    const updatedTasks = tasks.map((t: Task) => {
      if (t.id === taskId) {
        return { ...t, isDeleted: false };
      }
      return t;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
      filteredTasks = filteredTasks.filter((task:Task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === new Date(filterDate).toDateString();
      });
    }

    if (filterPriority) {
      filteredTasks = filteredTasks.filter((task: Task) => task.priority === filterPriority);
    }

    if (filterProject) {
      filteredTasks = filteredTasks.filter((task: Task) => task.project === filterProject);
    }

    if (filterLabel) {
      filteredTasks = filteredTasks.filter((task: Task ) => task.labels.includes(filterLabel));
    }


    if (selectedView === 'My Tasks') {
      filteredTasks = filteredTasks.filter((task: Task) => !task.isCompleted);
    } else if (selectedView === 'Completed') {
      filteredTasks = tasks.filter((task: Task) => task.isCompleted && !task.isDeleted);
    } else if (selectedView === 'Inbox') {
      filteredTasks = tasks.filter((task: Task)=> !task.isDeleted);
      if (filteredTasks.length === 0) {
        filteredTasks = tasksSample.filter(task => !task.isDeleted);
      }
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
      <List sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
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
                        {task.project && (
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
      </List>
    );
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
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

  const allProjects = [...new Set(tasks.map((task: Task) => task.project).filter(Boolean))];
  const allLabels = [...new Set(tasks.flatMap((task: Task) => task.labels).filter(Boolean))];

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
              U
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
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
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, pt: '64px' },
        }}
      >
        {drawerContent}
      </Drawer>

      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, pt: '64px' },
        }}
        open={sidebarOpen}
      >
        {drawerContent}
      </Drawer>

     
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && {
            ml: { sm: `${drawerWidth}px` },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          overflowY: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {selectedView}
          </Typography>
          {selectedView !== 'Trash' && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={() => setFilterOpen(true)}
            >
              Filter
            </Button>
          )}
        </Box>
        {renderTaskList()}
      </Box>

      
      <Modal open={quickAddOpen} onClose={handleQuickAddClose}>
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
            Add New Task
          </Typography>
          <TextField
            label="Task Name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTaskName.trim() !== '') {
                handleAddTask();
              }
            }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            label="Project"
            value={newTaskProject}
            onChange={(e) => setNewTaskProject(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Tags (comma separated)"
            value={newTaskTags}
            onChange={(e) => setNewTaskTags(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            helperText="E.g., work, personal, urgent"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button variant="outlined" onClick={handleQuickAddClose} color="error">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddTask}
              disabled={!newTaskName.trim()}
            >
              Add Task
            </Button>
          </Box>
        </Paper>
      </Modal>

      
      <Modal open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 350 },
            p: 4,
            borderRadius: typeof theme.shape.borderRadius === 'number'
              ? theme.shape.borderRadius * 2
              : `calc(${theme.shape.borderRadius} * 2)`,
            boxShadow: theme.shadows[8],
            outline: 'none',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to {selectedView === 'Trash' ? 'permanently delete' : 'move to trash'} "
            <Typography component="span" fontWeight="bold">{taskToDelete?.title}</Typography>"?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              {selectedView === 'Trash' ? 'Permanently Delete' : 'Move to Trash'}
            </Button>
          </Box>
        </Paper>
      </Modal>

     
      <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
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
              <MenuItem value=""><em>Any</em></MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Filter by Project</InputLabel>
            <Select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              label="Filter by Project"
            >
              <MenuItem value=""><em>Any</em></MenuItem>
              {allProjects.map(project => (
                <MenuItem key={String(project)} value={String(project)}>{String(project)}</MenuItem>
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
              <MenuItem value=""><em>Any</em></MenuItem>
              {allLabels.map(label => (
                <MenuItem key={String(label)} value={String(label)}>{String(label)}</MenuItem>
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

    </Box>
  );
};

export default Home;