import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material'; // Add useMediaQuery
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
  const [viewMode, setViewMode] = useState('Day'); // Default to Day view since we're focusing on teacher view
  const [userRole] = useState('teacher'); // Will be handled by backend later
  
  // Add responsive breakpoints
  const isMobile = useMediaQuery('(max-width:768px)');
  const isIPhoneSE = useMediaQuery('(max-width:375px)'); // iPhone SE width
  
  // Force Day view for small devices
  useEffect(() => {
    if (isIPhoneSE) {
      setViewMode('Day');
    }
  }, [isIPhoneSE]);

  // Prevent view mode changes on small devices
  const handleViewChange = (mode) => {
    if (isIPhoneSE) {
      return; // Always stay in Day view on small devices
    }
    setViewMode(mode);
  };

  const handleAddEvent = (newEvent) => {
    console.log('Adding new event with color:', newEvent.color);

    // Create new event with exact color from form
    const eventWithColor = {
      ...newEvent,
      id: Date.now(),
      color: newEvent.color,
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
        }}
      >
        {/* Hide CalendarLeft completely on iPhone SE for teachers */}
        {!isIPhoneSE && (
          <Box 
            sx={{ 
              width: isMobile ? '100%' : '240px',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            <CalanderLeft
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              viewMode={viewMode}
              onViewChange={handleViewChange}
              teachers={teachers}
              userRole={userRole}
              isMobile={isMobile}
            />
          </Box>
        )}
        <Box 
          sx={{ 
            flex: 1,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <CalanderRight
            events={events}
            selectedDate={selectedDate}
            onEventAdd={handleAddEvent}
            onEventDelete={handleDeleteEvent}
            viewMode={viewMode}
            onViewChange={handleViewChange}
            teachers={teachers}
            userRole={userRole}
            isIPhoneSE={isIPhoneSE}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;