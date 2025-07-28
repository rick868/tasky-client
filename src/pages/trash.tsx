import  { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Task = {
  id: string;
  title: string;
  description: string;
  isDeleted: boolean;
};

const Trash = () => {
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

  const handleRestore = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, isDeleted: false } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deletedTasks = tasks.filter(task => task.isDeleted);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Trash
      </Typography>
      <Typography variant="body2" gutterBottom>
        Items in trash will be deleted after 30 days.
      </Typography>
      {deletedTasks.length === 0 ? (
        <Typography>No items in trash</Typography>
      ) : (
        deletedTasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            onEdit={() => navigate(`/updateTask/${task.id}`)}
            onDelete={() => {}}
            showRestore
            onRestore={() => handleRestore(task.id)}
          />
        ))
      )}
    </Box>
  );
};

export default Trash;
