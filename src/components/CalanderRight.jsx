import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TodayIcon from '@mui/icons-material/Today';
import Month from './Month';
import Week from './Week';
import NewEventForm from './NewEventForm';
import TaskDetailsModal from './TaskDetailsModal';
import SearchIcon from '@mui/icons-material/Search';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const CalanderRight = ({
  events = [],
  selectedDate,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  teachers,
  viewMode = 'Month',
  onViewChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openEventForm, setOpenEventForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedWhatsAppEvents, setClickedWhatsAppEvents] = useState({}); // Add state to track clicked WhatsApp icons
  const [sentEvents, setSentEvents] = useState({}); // Add state to track events marked as sent

  // Log events for debugging
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log('Events in CalanderRight:', events);
  }, [events]);

  // Format date to display month and year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format date for the day view
  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Navigate to previous period (day, week, month)
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'Week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'Month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period (day, week, month)
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'Week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'Month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Change view mode (day, week, month)
  const handleViewChange = (mode) => {
    if (onViewChange) {
      onViewChange(mode);
    }
  };

  // Helper function to normalize date objects or strings to Date objects
  const normalizeDate = (dateInput) => {
    if (!dateInput) return null;
    return dateInput instanceof Date ? dateInput : new Date(dateInput);
  };

  // Compare two dates (ignoring time)
  const isSameDay = (date1, date2) => {
    const d1 = normalizeDate(date1);
    const d2 = normalizeDate(date2);
    if (!d1 || !d2) return false;

    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Filter events for the current month
  const getMonthEvents = () => {
    return events.filter((event) => {
      const eventDate = normalizeDate(event.date);
      if (!eventDate) return false;

      return (
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Filter events for the current week
  const getWeekEvents = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventDate = normalizeDate(event.date);
      if (!eventDate) return false;

      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  };

  // Filter events for the current day
  const getDayEvents = () => {
    return events.filter((event) => {
      const eventDate = normalizeDate(event.date);
      if (!eventDate) return false;

      return isSameDay(eventDate, currentDate);
    });
  };

  // Handle opening the event form
  const handleOpenEventForm = (hour, teacherId = null) => {
    // Format the hour to HH:MM format
    const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
    setSelectedTime(formattedHour);
    setOpenEventForm(true);
  };

  // Handle closing the event form
  const handleCloseEventForm = () => {
    setOpenEventForm(false);
  };

  // Handle submitting the event form
  const handleSubmitEvent = (eventData) => {
    handleCloseEventForm(); // Close the form
    if (onAddEvent) {
      onAddEvent({
        ...eventData,
        date: new Date(eventData.date).toISOString(), // Ensure date is formatted correctly
      });
    }
  };

  //handle event for whatspp
  const handleWhatsAppClick = (event) => {
    // Toggle the clicked state for this event
    setClickedWhatsAppEvents(prev => ({
      ...prev,
      [event.id]: !prev[event.id]
    }));
    
    // Only proceed with WhatsApp sharing if the icon hasn't been clicked before
    if (!clickedWhatsAppEvents[event.id]) {
      // You can implement the WhatsApp sharing functionality here
      // For example, opening a WhatsApp web link with event details:
      const message = `Event: ${event.title}\nDate: ${normalizeDate(
        event.date,
      )?.toLocaleDateString()}\nTime: ${event.startTime} - ${event.endTime}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Handle marking an event as sent
  const handleMarkAsSent = (event) => {
    setSentEvents(prev => ({
      ...prev,
      [event.id]: true
    }));
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenTaskModal(true);
  };

  // Handle task update
  const handleTaskUpdate = (updatedTask) => {
    if (onUpdateEvent) {
      onUpdateEvent(updatedTask);
    }
    setOpenTaskModal(false);
  };

  // Handle task deletion
  const handleTaskDelete = (taskId) => {
    if (onDeleteEvent) {
      onDeleteEvent(taskId);
    }
    setOpenTaskModal(false);
  };

  // Render month view
  const renderMonthView = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Month currentDate={currentDate} events={getMonthEvents()} />
      </Box>
    );
  };

  // Render week view
  const renderWeekView = () => {
    return (
      <Box sx={{ height: 'calc(100vh - 130px)', overflowY: 'auto' }}>
        <Week currentDate={currentDate} events={getWeekEvents()} />
      </Box>
    );
  };

  // Render day view
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const activeTeachers = teachers
      ? teachers.filter((teacher) => teacher.checked)
      : [];

    // Always show at least one column, even if no teachers are selected
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              activeTeachers.length > 0
                ? `80px repeat(${activeTeachers.length}, minmax(120px, 1fr))`
                : '80px 1fr', // One column for time + one empty column
            gridTemplateRows: `80px repeat(${hours.length}, 60px)`,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            minWidth: activeTeachers.length > 3 ? (80 + activeTeachers.length * 150) + 'px' : '100%', 
            // ^ Ensure minimum width based on number of teachers
            height: 'max-content',
          }}
        >
          {/* Empty top-left cell */}
          <Box
            sx={{
              gridColumn: '1 / 2',
              gridRow: '1 / 2',
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Time
            </Typography>
          </Box>

          {/* Teacher Headers - only show if there are active teachers */}
          {activeTeachers.length > 0 ? (
            activeTeachers.map((teacher, index) => (
              <Box
                key={teacher.id}
                sx={{
                  gridColumn: `${index + 2} / ${index + 3}`,
                  gridRow: '1 / 2',
                  borderRight:
                    index < activeTeachers.length - 1
                      ? '1px solid #e0e0e0'
                      : 'none',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: teacher.color || '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  {teacher.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }} noWrap>
                  {teacher.name}
                </Typography>
              </Box>
            ))
          ) : (
            // Empty header when no teachers are selected
            <Box
              sx={{
                gridColumn: '2 / 3',
                gridRow: '1 / 2',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No teachers selected
              </Typography>
            </Box>
          )}

          {/* Hour cells - always show */}
          {hours.map((hour) => {
            return (
              <React.Fragment key={hour}>
                {/* Hour label */}
                <Box
                  sx={{
                    gridColumn: '1 / 2',
                    gridRow: `${hour + 2} / ${hour + 3}`,
                    borderRight: '1px solid #e0e0e0',
                    borderBottom: hour < 23 ? '1px solid #e0e0e0' : 'none',
                    backgroundColor: '#f5f5f5',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2">
                    {hour === 0
                      ? '12 AM'
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
                  </Typography>
                </Box>

                {/* Teacher cells - only show if there are active teachers */}
                {activeTeachers.length > 0 ? (
                  activeTeachers.map((teacher, index) => {
                    // Find events for this teacher at this hour
                    const teacherEvents = events.filter((event) => {
                      if (!event.startTime || typeof event.startTime !== 'string')
                        return false;

                      const timeParts = event.startTime.split(':');
                      const eventHour = parseInt(timeParts[0], 10);

                      // Check if event is for this teacher and hour
                      return (
                        !isNaN(eventHour) &&
                        eventHour === hour &&
                        event.teacherId === teacher.id
                      );
                    });

                    return (
                      <Box
                        key={`${hour}-${teacher.id}`}
                        sx={{
                          gridColumn: `${index + 2} / ${index + 3}`,
                          gridRow: `${hour + 2} / ${hour + 3}`,
                          p: 0.5,
                          borderRight:
                            index < activeTeachers.length - 1
                              ? '1px solid #e0e0e0'
                              : 'none',
                          borderBottom: hour < 23 ? '1px solid #e0e0e0' : 'none',
                          minHeight: '60px',
                          position: 'relative',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                        onClick={() => {
                          // When clicking on an empty cell, open event form with pre-selected teacher
                          handleOpenEventForm(hour, teacher.id);
                        }}
                      >
                        {/* Display events in this cell */}
                        {teacherEvents.map((event, eventIndex) => (
                          <Paper
                            key={eventIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            sx={{
                              position: 'absolute',
                              top: '2px',
                              left: '2px',
                              right: '2px',
                              height: 'calc(100% - 4px)',
                              backgroundColor:
                                event.color || teacher.color || '#4285F4',
                              color: 'white',
                              p: 1,
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              zIndex: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                zIndex: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                filter: 'brightness(0.9)',
                              },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'bold' }}
                              noWrap
                            >
                              {event.title}
                            </Typography>
                            {event.students && event.students.length > 0 && (
                              <Box
                                sx={{
                                  mt: 0.5,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {event.students
                                  .slice(0, 3)
                                  .map((student, studentIndex) => {
                                    // Handle both string format and object format as per memory requirements
                                    const studentObj =
                                      typeof student === 'string'
                                        ? {
                                            id: studentIndex,
                                            name: student,
                                            attendance: 'present',
                                          }
                                        : student;

                                    return (
                                      <Box
                                        key={studentObj.id || studentIndex}
                                        sx={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          backgroundColor:
                                            'rgba(255,255,255,0.2)',
                                          borderRadius: '4px',
                                          px: 0.5,
                                          fontSize: '0.7rem',
                                        }}
                                      >
                                        {studentObj.name}
                                        {studentObj.attendance && (
                                          <Box
                                            sx={{
                                              ml: 0.5,
                                              width: 14,
                                              height: 14,
                                              borderRadius: '50%',
                                              backgroundColor:
                                                studentObj.attendance ===
                                                'present'
                                                  ? '#4CAF50'
                                                  : '#F44336',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: '0.6rem',
                                              fontWeight: 'bold',
                                            }}
                                          >
                                            {studentObj.attendance === 'present'
                                              ? 'P'
                                              : 'A'}
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })}
                                {event.students.length > 3 && (
                                  <Typography
                                    variant="caption"
                                    sx={{ opacity: 0.9 }}
                                  >
                                    +{event.students.length - 3}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Paper>
                        ))}
                      </Box>
                    );
                  })
                ) : (
                  // Empty cell when no teachers are selected
                  <Box
                    key={`${hour}-empty`}
                    sx={{
                      gridColumn: '2 / 3',
                      gridRow: `${hour + 2} / ${hour + 3}`,
                      borderBottom: hour < 23 ? '1px solid #e0e0e0' : 'none',
                      minHeight: '60px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    onClick={() => {
                      // When clicking on an empty cell with no teachers, show a message
                      alert(
                        'Please select at least one teacher from the sidebar to create an event.',
                      );
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Render agenda view
  const renderAgendaView = () => {
    // Filter events based on search term
    const filteredEvents = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description &&
          event.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Agenda View</Typography>

        {/* Search input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { mb: 2, mt: 2 },
          }}
          size="small"
        />

        {/* Display filtered events in a list */}
        {filteredEvents.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {searchTerm ? 'No matching events found' : 'No events scheduled'}
          </Typography>
        ) : (
          filteredEvents.map((event, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: `4px solid ${event.color || '#4285F4'}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {normalizeDate(event.date)?.toLocaleDateString()} •{' '}
                    {event.startTime} - {event.endTime}
                  </Typography>
                  {event.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {event.description}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {/* WhatsApp icon for sending messages */}
                  <WhatsAppIcon
                    sx={{
                      color: '#25D366',
                      cursor: 'pointer',
                      fontSize: 40,
                    }}
                    onClick={() => handleWhatsAppClick(event)}
                  />
                  
                  {/* Tick icon that changes to "Sent" when clicked */}
                  {sentEvents[event.id] ? (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#4CAF50', 
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      Sent
                    </Typography>
                  ) : (
                    <TaskAltIcon
                      sx={{
                        color: '#f44336', // Changed from #9e9e9e (gray) to #f44336 (red)
                        cursor: 'pointer',
                        fontSize: 40,
                      }}
                      onClick={() => handleMarkAsSent(event)}
                    />
                  )}
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    );
  };
  // Render the current view based on viewMode
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'Month':
        return renderMonthView();
      case 'Week':
        return renderWeekView();
      case 'Day':
        return (
          <Box
            sx={{
              height: '100%', // Take full height
              width: '100%', // Take full width
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden', /* Hide overflow at parent level */
            }}
          >
            {renderDayView()}
          </Box>
        );
      case 'Agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '82vw', // Constrain to viewport width
        overflow: 'hidden', // Hide overflow at container level
      }}
    >
      {/* Top Navigation */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          width: '100%',
          maxWidth: '100%', // Ensure the toolbar doesn't exceed container width
        }}
      >
        {/* Left side - Today button and navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleToday}
            sx={{
              textTransform: 'none',
              px: 3,
              borderColor: viewMode === 'Today' ? 'transparent' : '#e0e0e0',
              backgroundColor: viewMode === 'Today' ? '#000066' : 'white',
              color: viewMode === 'Today' ? 'white' : '#000066',
              '&:hover': {
                backgroundColor: viewMode === 'Today' ? '#000066' : '#f5f5f5',
                borderColor: viewMode === 'Today' ? 'transparent' : '#e0e0e0',
              },
              fontWeight: 'bold',
            }}
          >
            Today
          </Button>

          <IconButton onClick={handlePrevious} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={handleNext} size="small" sx={{ mr: 2 }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
            {viewMode === 'Day'
              ? formatDay(currentDate)
              : formatMonthYear(currentDate)}
          </Typography>
        </Box>

        {/* Right side - View mode buttons with updated styling */}
        <Box sx={{ display: 'flex' }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Button
              onClick={() => handleViewChange('Day')}
              sx={{
                textTransform: 'none',
                px: 3,
                borderColor: viewMode === 'Day' ? 'transparent' : '#e0e0e0',
                backgroundColor: viewMode === 'Day' ? '#000066' : 'white',
                color: viewMode === 'Day' ? 'white' : '#000066',
                '&:hover': {
                  backgroundColor: viewMode === 'Day' ? '#000066' : '#f5f5f5',
                  borderColor: viewMode === 'Day' ? 'transparent' : '#e0e0e0',
                },
                fontWeight: 'bold',
              }}
            >
              Day
            </Button>

            <Button
              onClick={() => handleViewChange('Week')}
              sx={{
                textTransform: 'none',
                px: 3,
                borderColor: viewMode === 'Week' ? 'transparent' : '#e0e0e0',
                backgroundColor: viewMode === 'Week' ? '#3366cc' : 'white',
                color: viewMode === 'Week' ? 'white' : '#3366cc',
                '&:hover': {
                  backgroundColor: viewMode === 'Week' ? '#3366cc' : '#f5f5f5',
                  borderColor: viewMode === 'Week' ? 'transparent' : '#e0e0e0',
                },
                fontWeight: 'bold',
              }}
            >
              Week
            </Button>

            <Button
              onClick={() => handleViewChange('Month')}
              sx={{
                textTransform: 'none',
                px: 3,
                borderColor: viewMode === 'Month' ? 'transparent' : '#e0e0e0',
                backgroundColor: viewMode === 'Month' ? '#ffcc00' : 'white',
                color: viewMode === 'Month' ? '#000000' : '#ffcc00',
                '&:hover': {
                  backgroundColor: viewMode === 'Month' ? '#ffcc00' : '#f5f5f5',
                  borderColor: viewMode === 'Month' ? 'transparent' : '#e0e0e0',
                },
                fontWeight: 'bold',
              }}
            >
              Month
            </Button>

            <Button
              onClick={() => handleViewChange('Agenda')}
              sx={{
                textTransform: 'none',
                px: 3,
                borderColor: viewMode === 'Agenda' ? 'transparent' : '#e0e0e0',
                backgroundColor: viewMode === 'Agenda' ? '#000066' : 'white',
                color: viewMode === 'Agenda' ? 'white' : '#000066',
                '&:hover': {
                  backgroundColor:
                    viewMode === 'Agenda' ? '#000066' : '#f5f5f5',
                  borderColor:
                    viewMode === 'Agenda' ? 'transparent' : '#e0e0e0',
                },
                fontWeight: 'bold',
              }}
            >
              Agenda
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>

      {/* Calendar Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden', /* Control overflow at this level */
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'calc(100vh - 130px)',
        }}
      >
        {renderCurrentView()}
      </Box>

      {/* New Event Form Dialog */}
      <NewEventForm
        open={openEventForm}
        onClose={handleCloseEventForm}
        onSubmit={handleSubmitEvent}
        initialDate={currentDate.toISOString().split('T')[0]}
        initialTime={selectedTime}
        teachers={teachers}
        initialTeacherId={selectedTeacherId}
      />

      {viewMode === 'Day' && (
        <TaskDetailsModal
          open={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          task={selectedEvent}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </Box>
  );
};

export default CalanderRight;
