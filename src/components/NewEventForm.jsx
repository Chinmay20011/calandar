import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';

const colorOptions = [
  { name: 'Blue', value: '#4285F4' },
  { name: 'Red', value: '#EA4335' },
  { name: 'Green', value: '#34A853' },
  { name: 'Yellow', value: '#FBBC05' },
  { name: 'Purple', value: '#8E24AA' },
  { name: 'Orange', value: '#FF9800' },
  { name: 'Teal', value: '#009688' },
  { name: 'Pink', value: '#E91E63' },
];

// Define duration options with clear labels
const durationOptions = ['1 hour', '1 hour 15 min', '1 hour 30 min'];

// Generate time options in 30 minute increments (12:00 PM to 11:30 AM) - reversed to start with PM
const generateTimeOptions = () => {
  const options = [];
  // Start with PM times (12 PM to 11:30 PM)
  for (let hour = 12; hour < 24; hour++) {
    const displayHour = hour === 12 ? 12 : hour - 12;

    // Add the hour:00 option
    options.push({
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${displayHour}:00 PM`,
    });

    // Add the hour:30 option
    options.push({
      value: `${hour.toString().padStart(2, '0')}:30`,
      label: `${displayHour}:30 PM`,
    });
  }

  // Then add AM times (12 AM to 11:30 AM)
  for (let hour = 0; hour < 12; hour++) {
    const displayHour = hour === 0 ? 12 : hour;

    // Add the hour:00 option
    options.push({
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${displayHour}:00 AM`,
    });

    // Add the hour:30 option
    options.push({
      value: `${hour.toString().padStart(2, '0')}:30`,
      label: `${displayHour}:30 AM`,
    });
  }

  return options;
};

const timeOptions = generateTimeOptions();

// Mock data for teachers, subjects, branches, and students
const teacherOptions = [
  'Mr. Sharma',
  'Mrs. Patel',
  'Dr. Singh',
  'Ms. Desai',
  'Mr. Kumar',
];

const subjectOptions = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
];

const branchOptions = [
  'Main Branch',
  'North Campus',
  'South Campus',
  'East Wing',
  'West Wing',
];

const studentOptions = [
  'Rohit',
  'Sneha',
  'Prahlad',
  'Sanjay',
  'Amit',
  'Priya',
  'Rahul',
  'Neha',
  'Vikram',
  'Pooja',
];

const NewEventForm = ({
  open,
  onClose,
  onSubmit,
  initialDate,
  initialTime,
  teachers = [],
  initialTeacherId = null,
}) => {
  const today = new Date();
  const formattedDate =
    initialDate ||
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(today.getDate()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: formattedDate,
    startTime: initialTime || '',
    duration: '1 hour',
    endTime: '',
    teacher: '',
    teacherId: null,
    subject: '',
    branch: '',
    students: [],
    location: '',
    color: '#4285F4',
  });

  const [errors, setErrors] = useState({});
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [studentAnchorEl, setStudentAnchorEl] = useState(null);
  const [teacherAnchorEl, setTeacherAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: initialDate || formattedDate,
      startTime: initialTime || prev.startTime,
    }));
  }, [initialDate, initialTime, formattedDate]);

  useEffect(() => {
    if (initialTeacherId && teachers && teachers.length > 0) {
      const selectedTeacher = teachers.find(
        (teacher) => teacher.id === initialTeacherId,
      );
      if (selectedTeacher) {
        setFormData((prev) => ({
          ...prev,
          teacher: selectedTeacher.name,
          teacherId: selectedTeacher.id,
          color: selectedTeacher.color || prev.color,
        }));
      }
    }
  }, [initialTeacherId, teachers, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Create a new form data object with the updated value
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // Update form data
    setFormData(updatedFormData);

    // Clear errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color: color,
    }));
    handleColorClose();
  };

  const handleStudentClick = (event) => {
    setStudentAnchorEl(event.currentTarget);
    setSearchQuery('');
  };

  const handleStudentClose = () => {
    setStudentAnchorEl(null);
  };

  const handleStudentToggle = (student) => {
    const currentStudents = [...formData.students];
    const studentIndex = currentStudents.indexOf(student);

    if (studentIndex === -1) {
      currentStudents.push(student);
    } else {
      currentStudents.splice(studentIndex, 1);
    }

    setFormData({
      ...formData,
      students: currentStudents,
    });
  };

  const handleRemoveStudent = (student) => {
    const currentStudents = [...formData.students];
    const studentIndex = currentStudents.indexOf(student);

    if (studentIndex !== -1) {
      currentStudents.splice(studentIndex, 1);
      setFormData({
        ...formData,
        students: currentStudents,
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTeacherClick = (event) => {
    setTeacherAnchorEl(event.currentTarget);
    setTeacherSearchQuery('');
  };

  const handleTeacherClose = () => {
    setTeacherAnchorEl(null);
  };

  const handleTeacherSelect = (teacherName, teacherId, teacherColor) => {
    setFormData({
      ...formData,
      teacher: teacherName,
      teacherId: teacherId,
      color: teacherColor || formData.color,
    });
    handleTeacherClose();
  };

  const handleTeacherSearchChange = (event) => {
    setTeacherSearchQuery(event.target.value);
  };

  const filteredStudents = studentOptions.filter((student) =>
    student.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()),
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const eventData = {
        ...formData,
        color: formData.color,
        teacherId: formData.teacherId,
        students: formData.students.map((student, index) => {
          if (
            typeof student === 'object' &&
            student !== null &&
            student.hasOwnProperty('id') &&
            student.hasOwnProperty('name')
          ) {
            return {
              ...student,
              attendance: student.attendance || 'absent',
            };
          }

          return {
            id: index,
            name: typeof student === 'string' ? student : '',
            attendance: 'absent',
          };
        }),
      };

      onSubmit(eventData);
      onClose();
    }
  };

  const colorOpen = Boolean(colorAnchorEl);
  const studentOpen = Boolean(studentAnchorEl);
  const teacherOpen = Boolean(teacherAnchorEl);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          overflow: 'visible',
          width: '700px',
          maxWidth: '90vw',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: formData.color,
          color: '#ffffff',
        }}
      >
        <Typography variant="h6">Create New Event</Typography>

        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />

          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <AccessTimeIcon
                  sx={{ mt: 4, mr: 1, color: 'text.secondary' }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="start-time-label">Start Time</InputLabel>
                  <Select
                    labelId="start-time-label"
                    name="startTime"
                    value={formData.startTime || ''}
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      const startOption = timeOptions.find(opt => opt.value === newStartTime);
                      
                      if (startOption && formData.duration) {
                        // Parse start time
                        const [hours, minutes] = newStartTime.split(':').map(Number);
                        
                        // Calculate minutes to add
                        const minutesToAdd = formData.duration === '1 hour 30 min' ? 90 : 
                                          formData.duration === '1 hour 15 min' ? 75 : 60;

                        // Calculate end time
                        let totalMinutes = hours * 60 + minutes + minutesToAdd;
                        let endHours = Math.floor(totalMinutes / 60);
                        if (endHours >= 24) endHours -= 24;
                        const endMinutes = totalMinutes % 60;

                        // Format end time
                        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                        const endOption = timeOptions.find(opt => opt.value === endTime);

                        setFormData({
                          ...formData,
                          startTime: newStartTime,
                          endTime: endOption ? endTime : ''
                        });
                      } else {
                        setFormData({
                          ...formData,
                          startTime: newStartTime,
                          endTime: ''
                        });
                      }
                    }}
                    label="Start Time"
                  >
                    {timeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="duration-label">Duration</InputLabel>
                <Select
                  labelId="duration-label"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={(e) => {
                    const newDuration = e.target.value;
                    
                    if (formData.startTime) {
                      // Parse start time
                      const [hours, minutes] = formData.startTime.split(':').map(Number);
                      
                      // Calculate minutes to add
                      const minutesToAdd = newDuration === '1 hour 30 min' ? 90 : 
                                        newDuration === '1 hour 15 min' ? 75 : 60;

                      // Calculate end time
                      let totalMinutes = hours * 60 + minutes + minutesToAdd;
                      let endHours = Math.floor(totalMinutes / 60);
                      if (endHours >= 24) endHours -= 24;
                      const endMinutes = totalMinutes % 60;

                      // Format end time
                      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                      const endOption = timeOptions.find(opt => opt.value === endTime);

                      setFormData({
                        ...formData,
                        duration: newDuration,
                        endTime: endOption ? endTime : ''
                      });
                    } else {
                      setFormData({
                        ...formData,
                        duration: newDuration,
                        endTime: ''
                      });
                    }
                  }}
                  label="Duration"
                >
                  {durationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <AccessTimeIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="end-time-label">End Time</InputLabel>
                  <TextField
                    value={formData.endTime ? timeOptions.find(opt => opt.value === formData.endTime)?.label || '' : ''}
                    label="End Time"
                    disabled
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PersonIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <FormControl fullWidth margin="normal">
                  <Box
                    onClick={handleTeacherClick}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      p: 1,
                      minHeight: '56px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {formData.teacher ? formData.teacher : 'Select Teacher'}
                  </Box>
                  <Popover
                    open={teacherOpen}
                    anchorEl={teacherAnchorEl}
                    onClose={handleTeacherClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box sx={{ width: '250px' }}>
                      <TextField
                        placeholder="Search teachers"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={teacherSearchQuery}
                        onChange={handleTeacherSearchChange}
                        sx={{ m: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                        {filteredTeachers.length > 0 ? (
                          filteredTeachers.map((teacher) => (
                            <ListItem
                              key={teacher.id}
                              dense
                              button
                              onClick={() =>
                                handleTeacherSelect(
                                  teacher.name,
                                  teacher.id,
                                  teacher.color,
                                )
                              }
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.04)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: teacher.color || '#ccc',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  mr: 1,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {teacher.name
                                  .split(' ')
                                  .map((part) => part[0])
                                  .join('')}
                              </Box>
                              <ListItemText primary={teacher.name} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No teachers found" />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Popover>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <SubjectIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    label="Subject"
                  >
                    {subjectOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <AccountTreeIcon
                  sx={{ mt: 4, mr: 1, color: 'text.secondary' }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select
                    labelId="branch-label"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    label="Branch"
                  >
                    {branchOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <GroupIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <FormControl fullWidth margin="normal">
                  <Box
                    onClick={handleStudentClick}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      p: 1,
                      minHeight: '56px',
                      cursor: 'pointer',
                    }}
                  >
                    {formData.students.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {formData.students.map((student) => (
                          <Chip
                            key={student}
                            label={student}
                            onDelete={() => handleRemoveStudent(student)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography color="text.secondary" sx={{ p: 1 }}>
                        Select students
                      </Typography>
                    )}
                  </Box>
                  <Popover
                    open={studentOpen}
                    anchorEl={studentAnchorEl}
                    onClose={handleStudentClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box sx={{ width: '250px' }}>
                      <TextField
                        placeholder="Search students"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ m: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <ListItem
                              key={student}
                              dense
                              button
                              onClick={() => handleStudentToggle(student)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={
                                    formData.students.indexOf(student) !== -1
                                  }
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText primary={student} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No students found" />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Popover>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOnIcon
                  sx={{ mt: 4, mr: 1, color: 'text.secondary' }}
                />
                <TextField
                  name="location"
                  label="Location"
                  fullWidth
                  value={formData.location}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CircleIcon sx={{ mt: 4, mr: 1, color: formData.color }} />
                <FormControl fullWidth margin="normal">
                  <InputLabel shrink>Color</InputLabel>
                  <Box
                    onClick={handleColorClick}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      p: 1,
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: formData.color,
                      color: '#ffffff',
                      minHeight: '40px',
                    }}
                  >
                    Select Color
                  </Box>
                  <Popover
                    open={colorOpen}
                    anchorEl={colorAnchorEl}
                    onClose={handleColorClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 1,
                      }}
                    >
                      {colorOptions.map((color) => (
                        <Box
                          key={color.value}
                          onClick={() => handleColorSelect(color.value)}
                          sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: color.value,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border:
                              formData.color === color.value
                                ? '2px solid #000'
                                : 'none',
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Popover>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '4px',
            textTransform: 'none',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventForm;
