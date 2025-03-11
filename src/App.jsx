import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CalanderLeft from './components/CalanderLeft';
import CalanderRight from './components/CalanderRight';

// Mock data for teachers list
const teachersList = [
  { id: 1, name: 'Nirga Naik', checked: true, color: '#4285F4' },
  { id: 2, name: 'Nirmal', checked: true, color: '#EA4335' },
  { id: 3, name: 'Nirvisha', checked: true, color: '#34A853' },
  { id: 4, name: 'Nisha Sadhani', checked: true, color: '#FBBC05' },
  { id: 5, name: 'Panklee', checked: true, color: '#8E24AA' },
  { id: 6, name: 'Parmeet Kaur', checked: true, color: '#FF9800' },
  { id: 7, name: 'Pournima Khanapure', checked: true, color: '#009688' },
  { id: 8, name: 'Prachi', checked: true, color: '#E91E63' },
  { id: 9, name: 'Seema Khatri', checked: true, color: '#3F51B5' },
  { id: 10, name: 'Shahjad Ali', checked: true, color: '#795548' },
  { id: 11, name: 'Shilpa Makar', checked: true, color: '#607D8B' },
  { id: 12, name: 'Shilpa Sharma', checked: true, color: '#9C27B0' },
  { id: 13, name: 'Shraddha Shetty', checked: true, color: '#00BCD4' },
  { id: 14, name: 'Shruti West', checked: true, color: '#FFC107' },
  { id: 15, name: 'Sneha Mackwani', checked: true, color: '#FF5722' },
  { id: 16, name: 'Suryanarayana', checked: true, color: '#673AB7' },
  { id: 17, name: 'Tarang Singh', checked: false, color: '#2196F3' },
  { id: 18, name: 'Tasks', checked: true, color: '#F44336' },
  { id: 19, name: 'Tulsi', checked: true, color: '#4CAF50' },
  { id: 20, name: 'Vidhi Rajani', checked: true, color: '#CDDC39' },
  { id: 21, name: 'Vishwajeet Barule', checked: true, color: '#FF4081' },
];

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [teachers, setTeachers] = useState(teachersList);
  const [viewMode, setViewMode] = useState('Month');

  const handleAddEvent = (newEvent) => {
    console.log('Adding new event with color:', newEvent.color); // Debug log

    // Create new event with exact color from form
    const eventWithColor = {
      ...newEvent,
      id: Date.now(),
      color: newEvent.color, // Keep exact color
    };

    setEvents((prevEvents) => [...prevEvents, eventWithColor]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    console.log('Updating event:', updatedEvent);

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const handleDeleteEvent = (eventId) => {
    console.log('Deleting event with ID:', eventId);

    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleToggleTeacher = (id) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === id ? { ...teacher, checked: !teacher.checked } : teacher,
      ),
    );
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: '240px', borderRight: '1px solid #e0e0e0' }}>
        <CalanderLeft
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          events={events}
          teachers={teachers}
          onToggleTeacher={handleToggleTeacher}
          onViewChange={handleViewChange}
          onAddEvent={handleAddEvent}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <CalanderRight
          events={events}
          selectedDate={selectedDate}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          teachers={teachers}
          viewMode={viewMode}
          onViewChange={handleViewChange}
        />
      </Box>
    </Box>
  );
};
export default App;
