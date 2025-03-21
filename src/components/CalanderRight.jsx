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
  isIPhoneSE = false,
  isMobile = false,
  userRole = 'admin',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openEventForm, setOpenEventForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedWhatsAppEvents, setClickedWhatsAppEvents] = useState({}); // Add state to track clicked WhatsApp icons
  const [sentEvents, setSentEvents] = useState({}); // Add state to track events marked as sent

  // Add state for teacher leave data
  const [teacherLeaveData, setTeacherLeaveData] = useState([]);

  // Static test data for teacher leaves
  useEffect(() => {
    // In a real application, this would come from an API call
    const staticLeaveData = [
      {
        teacherId: teachers && teachers.length > 0 ? teachers[0].id : null, // First teacher
        date: new Date().toISOString().split('T')[0], // Today
        status: 'leave',
      }
      // Add more test data as needed
    ];

    setTeacherLeaveData(staticLeaveData);
  }, [teachers]);

  // Log events for debugging
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log('Events in CalanderRight:', events);
  }, [events]);

  // Update current time every 30 seconds for smoother movement
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    
    // Set initial time
    updateTime();
    
    const timer = setInterval(updateTime, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

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
    setSelectedTeacherId(teacherId);
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
    setClickedWhatsAppEvents((prev) => ({
      ...prev,
      [event.id]: !prev[event.id],
    }));

    // Only proceed with WhatsApp sharing if the icon hasn't been clicked before
    if (!clickedWhatsAppEvents[event.id]) {
      // Format date and time
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });

      // Convert 24-hour format to 12-hour format with AM/PM
      const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      const startTime = formatTime(event.startTime);
      const endTime = formatTime(event.endTime);

      // Find teacher name
      const teacher = teachers.find(t => t.id === event.teacherId);
      const teacherName = teacher ? teacher.name : 'Admin';

      // Format the message with emojis and proper alignment
      const message = `📅 Date: ${formattedDate}
⏰ Time: ${startTime} - ${endTime}

📍 Location: ${event.location || 'North Campus'}
👨‍🏫 Teacher: ${teacherName}
📖 Subject: ${event.subject || 'Chemistry'}
🏢 Branch: ${event.branch || 'Main Branch'}`


      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Handle marking an event as sent
  const handleMarkAsSent = (event) => {
    setSentEvents((prev) => ({
      ...prev,
      [event.id]: true,
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

  // Check if a teacher is on leave for the current day
  const isTeacherOnLeave = (teacherId) => {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    return teacherLeaveData.some(
      (leave) =>
        leave.teacherId === teacherId &&
        leave.date === currentDateStr &&
        leave.status === 'leave',
    );
  };

  // Check if event has ended
  const isEventEnded = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    eventDate.setHours(endHour, endMinute);
    return now > eventDate;
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

    // For iPhone SE, limit the number of visible teachers
    const visibleTeachers = isIPhoneSE ? 
      (activeTeachers.length > 0 ? [activeTeachers[2]] : []) : 
      activeTeachers;

    // Calculate current time position
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const timePosition = ((currentHour + currentMinute / 60) * 60) + 80; // 80px is header height

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              visibleTeachers.length > 0
                ? `80px repeat(${visibleTeachers.length}, minmax(120px, 1fr))`
                : '80px 1fr',
            gridTemplateRows: `80px repeat(${hours.length}, 60px)`,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            minWidth:
              visibleTeachers.length > 3 && !isIPhoneSE
                ? 80 + visibleTeachers.length * 150 + 'px'
                : '100%',
            height: 'max-content',
            position: 'relative',
          }}
        >
          {/* Current time indicator - only show in Day view */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${timePosition}px`,
              height: '2px',
              backgroundColor: '#f44336',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              transition: 'top 0.3s linear',
              width: isIPhoneSE ? 'calc(100% - 2px)' : '100%', // Adjust width for iPhone SE border
              '&::before': {
                content: '""',
                position: 'absolute',
                left: isIPhoneSE ? '70px' : '72px',
                top: '-4px',
                width: isIPhoneSE ? '6px' : '8px',
                height: isIPhoneSE ? '6px' : '8px',
                backgroundColor: '#f44336',
                borderRadius: '50%',
                boxShadow: '0 0 4px rgba(244, 67, 54, 0.5)',
              },
              '&::after': {
                content: `"${currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true 
                })}"`,
                position: 'absolute',
                left: '8px',
                top: isIPhoneSE ? '-11px' : '-10px',
                fontSize: isIPhoneSE ? '0.6rem' : '0.75rem',
                fontWeight: 'bold',
                color: '#f44336',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: isIPhoneSE ? '1px 3px' : '2px 4px',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                lineHeight: 1,
              }
            }}
          />

          {/* Empty top-left cell */}
          <Box
            sx={{
              gridColumn: '1 / 2',
              gridRow: '1 / 2',
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
              p: isIPhoneSE ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Time
            </Typography>
          </Box>

          {/* Teacher Headers - only show if there are visible teachers */}
          {visibleTeachers.length > 0 ? (
            visibleTeachers.map((teacher, index) => {
              const onLeave = isTeacherOnLeave(teacher.id);

              return (
                <Box
                  key={teacher.id}
                  sx={{
                    gridColumn: `${index + 2} / ${index + 3}`,
                    gridRow: '1 / 2',
                    borderRight:
                      index < visibleTeachers.length - 1
                        ? '1px solid #e0e0e0'
                        : 'none',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    p: isIPhoneSE ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    overflow: 'hidden',
                    ...(onLeave && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: '#f44336',
                      },
                    }),
                  }}
                >
                  <Box
                    sx={{
                      width: isIPhoneSE ? 30 : 40,
                      height: isIPhoneSE ? 30 : 40,
                      borderRadius: '50%',
                      backgroundColor: teacher.color || '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      mb: isIPhoneSE ? 0.5 : 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      fontSize: isIPhoneSE ? '0.7rem' : '0.8rem',
                    }}
                  >
                    {teacher.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      fontSize: isIPhoneSE ? '0.7rem' : '0.8rem',
                    }}
                    noWrap
                  >
                    {teacher.name}
                  </Typography>
                </Box>
              );
            })
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
                    p: isIPhoneSE ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: isIPhoneSE ? '0.7rem' : '0.8rem' }}>
                    {hour === 0
                      ? '12 AM'
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
                  </Typography>
                </Box>

                {/* Teacher cells - only show if there are visible teachers */}
                {visibleTeachers.length > 0 ? (
                  visibleTeachers.map((teacher, index) => {
                    // Find events for this teacher at this hour
                    const teacherEvents = events.filter((event) => {
                      if (
                        !event.startTime ||
                        typeof event.startTime !== 'string'
                      )
                        return false;

                      const timeParts = event.startTime.split(':');
                      const eventHour = parseInt(timeParts[0], 10);

                      // Check if event is for this teacher and hour
                      return (
                        !isNaN(eventHour) &&
                        eventHour === hour &&
                        event.teacherId === teacher.id &&
                        isSameDay(normalizeDate(event.date), currentDate)
                      );
                    });

                    // Check if teacher is on leave
                    const onLeave = isTeacherOnLeave(teacher.id);

                    return (
                      <Box
                        key={`${hour}-${teacher.id}`}
                        sx={{
                          gridColumn: `${index + 2} / ${index + 3}`,
                          gridRow: `${hour + 2} / ${hour + 3}`,
                          p: 0.5,
                          borderRight:
                            index < visibleTeachers.length - 1
                              ? '1px solid #e0e0e0'
                              : 'none',
                          borderBottom:
                            hour < 23 ? '1px solid #e0e0e0' : 'none',
                          minHeight: isIPhoneSE ? '50px' : '60px',
                          position: 'relative',
                          cursor: 'pointer', // Always use pointer cursor
                          '&:hover': {
                            backgroundColor: onLeave
                              ? 'rgba(0, 0, 0, 0.02)'
                              : 'rgba(0, 0, 0, 0.04)',
                          },
                          backgroundColor: onLeave
                            ? 'rgba(244, 67, 54, 0.03)'
                            : 'transparent',
                          opacity: onLeave ? 0.85 : 1,
                          transition: 'all 0.2s ease-in-out',
                          ...(onLeave && {
                            backgroundImage:
                              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(244, 67, 54, 0.03) 10px, rgba(244, 67, 54, 0.03) 20px)',
                          }),
                        }}
                        onClick={() => {
                          // Always allow creating events, even if teacher is on leave
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
                              backgroundColor: isEventEnded(event) 
                                ? '#E0E0E0' // Gray color for ended events
                                : event.color || teacher.color || '#4285F4',
                              color: isEventEnded(event) ? '#757575' : 'white',
                              p: isIPhoneSE ? 0.5 : 1,
                              borderRadius: '4px',
                              fontSize: isIPhoneSE ? '0.65rem' : '0.75rem',
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
                              opacity: onLeave ? 0.6 : 1,
                              ...(onLeave && {
                                filter: 'grayscale(30%)',
                                border: '1px solid rgba(244, 67, 54, 0.3)',
                              }),
                              transition: 'all 0.3s ease-in-out',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: isIPhoneSE ? '0.6rem' : '0.7rem'
                              }}
                              noWrap
                            >
                              {event.title}
                            </Typography>
                            {event.students && event.students.length > 0 && !isIPhoneSE && (
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

                        {/* Show "On Leave" indicator if teacher is on leave and no events */}
                        {onLeave && teacherEvents.length === 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: '#f44336',
                              textAlign: 'center',
                              width: '90%',
                              backgroundColor: 'rgba(244, 67, 54, 0.05)',
                              borderRadius: '4px',
                              py: 0.5,
                              px: 1,
                              border: '1px dashed rgba(244, 67, 54, 0.3)',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontStyle: 'italic',
                                fontWeight: 'medium',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                fontSize: isIPhoneSE ? '0.6rem' : '0.7rem'
                              }}
                            >
                              On Leave
                            </Typography>
                          </Box>
                        )}
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
                      minHeight: isIPhoneSE ? '50px' : '60px',
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
      <Box sx={{ p: isIPhoneSE ? 1 : 2 }}>
        <Typography variant="h6" sx={{ fontSize: isIPhoneSE ? '1.1rem' : '1.25rem' }}>Agenda View</Typography>

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
                p: isIPhoneSE ? 1 : 2,
                mb: 2,
                borderLeft: `4px solid ${event.color || '#4285F4'}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isIPhoneSE ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isIPhoneSE ? 'flex-start' : 'flex-start',
                }}
              >
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: isIPhoneSE ? '0.9rem' : '1rem'
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: isIPhoneSE ? '0.75rem' : '0.875rem'
                    }}
                  >
                                        {normalizeDate(event.date)?.toLocaleDateString()} •{' '}
                    {event.startTime} - {event.endTime}
                  </Typography>
                  {event.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1,
                        fontSize: isIPhoneSE ? '0.75rem' : '0.875rem'
                      }}
                    >
                      {event.description}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    mt: isIPhoneSE ? 1 : 0
                  }}
                >
                  {/* WhatsApp icon for sending messages */}
                  <WhatsAppIcon
                    sx={{
                      color: '#25D366',
                      cursor: 'pointer',
                      fontSize: isIPhoneSE ? 30 : 40,
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
                        fontSize: isIPhoneSE ? '14px' : '16px',
                      }}
                    >
                      Sent
                    </Typography>
                  ) : (
                    <TaskAltIcon
                      sx={{
                        color: '#f44336',
                        cursor: 'pointer',
                        fontSize: isIPhoneSE ? 30 : 40,
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
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
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

  // Add an effect to update events periodically
  useEffect(() => {
    // Force re-render every minute to update event colors
    const interval = setInterval(() => {
      setCurrentDate(new Date(currentDate)); // This will trigger a re-render
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: isIPhoneSE ? '100vw' : '82vw',
        overflow: 'hidden',
      }}
    >
      {/* Top Navigation - simplified for iPhone SE */}
      <Paper
        elevation={0}
        sx={{
          p: isIPhoneSE ? 1 : 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Left side - Today button and navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Hide Today button on iPhone SE */}
          {!isIPhoneSE && (
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
          )}

          <IconButton onClick={handlePrevious} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={handleNext} size="small" sx={{ mr: 2 }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 'normal', fontSize: isIPhoneSE ? '0.9rem' : 'inherit' }}>
            {viewMode === 'Day'
              ? formatDay(currentDate)
              : formatMonthYear(currentDate)}
          </Typography>
        </Box>

        {/* Right side - View mode buttons - hide for teachers on iPhone SE */}
        {!(isIPhoneSE && userRole === 'teacher') && (
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
                  px: isIPhoneSE ? 1 : 3,
                  fontSize: isIPhoneSE ? '0.7rem' : 'inherit',
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
                  px: isIPhoneSE ? 1 : 3,
                  fontSize: isIPhoneSE ? '0.7rem' : 'inherit',
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
                  px: isIPhoneSE ? 1 : 3,
                  fontSize: isIPhoneSE ? '0.7rem' : 'inherit',
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
                  px: isIPhoneSE ? 1 : 3,
                  fontSize: isIPhoneSE ? '0.7rem' : 'inherit',
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
        )}
      </Paper>

      {/* Calendar Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
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