import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

type TaskCardProps = {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  onRestore?: () => void; 
  showRestore?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  onEdit,
  onDelete,
  onRestore,
  showRestore = false,
}) => {
  return (
    <Card sx={{ minWidth: 200, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>Edit</Button>
        {!showRestore && <Button size="small" color="error" onClick={onDelete}>Delete</Button>}
        {showRestore && onRestore && (
          <Button size="small" color="primary" onClick={onRestore}>
            Restore
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default TaskCard;
