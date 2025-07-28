import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  lastUpdated: string;
};

const UpdateTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks && id) {
      const tasks: Task[] = JSON.parse(storedTasks);
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description);
        setIsCompleted(foundTask.isCompleted);
      }
    }
  }, [id]);

  const handleUpdate = () => {
    if (!task) return;
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) return;
    const tasks: Task[] = JSON.parse(storedTasks);
    const updatedTasks = tasks.map(t =>
      t.id === task.id
        ? {
            ...t,
            title,
            description,
            lastUpdated: new Date().toISOString(),
          }
        : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigate('/tasks');
  };

  const handleToggleComplete = () => {
    if (!task) return;
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) return;
    const tasks: Task[] = JSON.parse(storedTasks);
    const updatedTasks = tasks.map(t =>
      t.id === task.id
        ? {
            ...t,
            isCompleted: !isCompleted,
            lastUpdated: new Date().toISOString(),
          }
        : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigate('/tasks');
  };

  if (!task) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <Typography>Task not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Update Task
      </Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        rows={4}
        margin="normal"
        fullWidth
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Task
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleToggleComplete}>
          {isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateTask;
