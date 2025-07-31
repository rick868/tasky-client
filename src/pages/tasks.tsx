import  { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
   
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([]);
    }
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/updateTask/${id}`);
  };

  const handleDelete = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, isDeleted: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const activeTasks = tasks.filter(task => !task.isCompleted && !task.isDeleted);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Tasks
      </Typography>
      {activeTasks.length === 0 ? (
        <Typography>You don't have any tasks</Typography>
      ) : (
        activeTasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            onEdit={() => handleEdit(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))
      )}
    </Box>
  );
};

export default Tasks;
