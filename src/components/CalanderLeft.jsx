import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Avatar,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewEventForm from './NewEventForm';
import MiniCalendar from './MiniCalendar';

// Get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const CalanderLeft = ({ onAddEvent, onDateSelect, selectedDate, teachers, onToggleTeacher }) => {
  const [openEventForm, setOpenEventForm] = React.useState(false);

  const handleToggle = (id) => {
    if (onToggleTeacher) {
      onToggleTeacher(id);
    }
  };

  const handleOpenEventForm = () => {
    setOpenEventForm(true);
  };

  const handleCloseEventForm = () => {
    setOpenEventForm(false);
  };

  const handleSubmitEvent = (eventData) => {
    if (onAddEvent) {
      onAddEvent(eventData);
    }
    handleCloseEventForm();
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '250px', 
      display: 'flex', 
      flexDirection: 'column',
      p: 1,
      borderRight: '1px solid #e0e0e0'
    }}>
      {/* Add Event Button */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleOpenEventForm}
        sx={{ 
          mb: 2, 
          textTransform: 'none',
          fontSize: '0.85rem',
          py: 1
        }}
        fullWidth
      >
        ADD EVENT
      </Button>

      {/* Mini Calendar */}
      <Box sx={{ mb: 2 }}>
        <MiniCalendar 
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </Box>

      {/* Teachers List */}
      <Box sx={{ mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          fontWeight="bold" 
          sx={{ 
            px: 1, 
            mb: 1,
            fontSize: '0.85rem'
          }}
        >
          Teachers
        </Typography>
        <List dense disablePadding>
          {teachers.map((teacher) => (
            <ListItem 
              key={teacher.id} 
              dense 
              button 
              onClick={() => handleToggle(teacher.id)}
              sx={{ 
                py: 0.5,
                px: 1
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Checkbox
                  edge="start"
                  checked={teacher.checked}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                  sx={{
                    color: teacher.color,
                    '&.Mui-checked': {
                      color: teacher.color,
                    },
                    p: 0.5
                  }}
                />
              </ListItemIcon>
              <ListItemText 
                primary={teacher.name} 
                primaryTypographyProps={{ 
                  style: { 
                    textDecoration: teacher.checked ? 'none' : 'line-through',
                    color: teacher.checked ? 'inherit' : '#9e9e9e',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  } 
                }}
              />
              <Avatar 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  fontSize: '0.7rem', 
                  bgcolor: teacher.color,
                  opacity: teacher.checked ? 1 : 0.5,
                  ml: 0.5
                }}
              >
                {getInitials(teacher.name)}
              </Avatar>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* New Event Form Dialog */}
      <NewEventForm
        open={openEventForm}
        onClose={handleCloseEventForm}
        onSubmit={handleSubmitEvent}
        teachers={teachers.filter(t => t.checked)}
      />
    </Box>
  );
};

CalanderLeft.propTypes = {
  onAddEvent: PropTypes.func,
  onDateSelect: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  teachers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggleTeacher: PropTypes.func
};

export default CalanderLeft;