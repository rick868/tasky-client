import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const NewTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      isCompleted: false,
      isDeleted: false,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setTitle('');
    setDescription('');
    setSuccessMessage('Task created successfully');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        New Task
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Create Task
        </Button>
      </Box>
      {successMessage && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default NewTask;
