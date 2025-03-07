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
  InputAdornment
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
  { name: 'Pink', value: '#E91E63' }
];

const durationOptions = [
  '1 hour',
  '1.5 hours',
  '2 hours',
  '2.5 hours'
];

// Mock data for teachers, subjects, branches, and students
const teacherOptions = [
  'Mr. Sharma',
  'Mrs. Patel',
  'Dr. Singh',
  'Ms. Desai',
  'Mr. Kumar'
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
  'Economics'
];

const branchOptions = [
  'Main Branch',
  'North Campus',
  'South Campus',
  'East Wing',
  'West Wing'
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
  'Pooja'
];

const NewEventForm = ({ open, onClose, onSubmit, initialDate, initialTime }) => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: formattedDate,
    startTime: initialTime || '',
    duration: '1 hour',
    endTime: '',
    teacher: '',
    subject: '',
    branch: '',
    students: [],
    location: '',
    color: '#4285F4'
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset form data when initialDate or initialTime changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: initialDate || formattedDate,
      startTime: initialTime || prev.startTime
    }));
  }, [initialDate, initialTime, formattedDate]);
  
  const [errors, setErrors] = useState({});
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [studentAnchorEl, setStudentAnchorEl] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is filled
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Calculate end time when start time or duration changes
    if (name === 'startTime' || name === 'duration') {
      calculateEndTime(name === 'startTime' ? value : formData.startTime, name === 'duration' ? value : formData.duration);
    }
  };
  
  // Function to calculate end time based on start time and duration
  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return;
    
    // Extract hours from duration (e.g., "1.5 hours" -> 1.5)
    const durationHours = parseFloat(duration.split(' ')[0]);
    
    if (isNaN(durationHours)) return;
    
    // Create a date object with the start time
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    // Calculate end time by adding duration in milliseconds
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
    
    // Format end time as HH:MM
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}`;
    
    setFormData(prev => ({
      ...prev,
      endTime: endTime
    }));
  };
  
  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };
  
  const handleColorClose = () => {
    setColorAnchorEl(null);
  };
  
  const handleColorSelect = (color) => {
    console.log('Selected color:', color); // Debug log
    setFormData(prev => ({
      ...prev,
      color: color
    }));
    handleColorClose();
  };
  
  const handleStudentClick = (event) => {
    setStudentAnchorEl(event.currentTarget);
    setSearchQuery(''); // Reset search when opening popover
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
      students: currentStudents
    });
  };
  
  const handleRemoveStudent = (student) => {
    const currentStudents = [...formData.students];
    const studentIndex = currentStudents.indexOf(student);
    
    if (studentIndex !== -1) {
      currentStudents.splice(studentIndex, 1);
      setFormData({
        ...formData,
        students: currentStudents
      });
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Filter students based on search query
  const filteredStudents = studentOptions.filter(student => 
    student.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Ensure we're passing the exact selected color
      const eventData = {
        ...formData,
        color: formData.color // Pass the exact selected color
      };
      console.log('Submitting event with color:', eventData.color); // Debug log
      onSubmit(eventData);
      onClose(); // Close the form after submission
    }
  };
  
  const colorOpen = Boolean(colorAnchorEl);
  const studentOpen = Boolean(studentAnchorEl);
  
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
          maxWidth: '90vw'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        backgroundColor: formData.color,
        color: '#ffffff'
      }}>
        <Typography variant="h6">Create New Event</Typography>

        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* Color selection at the top */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          </Box>
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
                <AccessTimeIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <TextField
                  name="startTime"
                  label="Start Time"
                  type="time"
                  fullWidth
                  value={formData.startTime}
                  onChange={handleInputChange}
                  margin="normal"
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="duration-label">Duration</InputLabel>
                <Select
                  labelId="duration-label"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
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
                <TextField
                  name="endTime"
                  label="End Time"
                  type="time"
                  fullWidth
                  value={formData.endTime}
                  onChange={handleInputChange}
                  margin="normal"
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PersonIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="teacher-label">Teacher</InputLabel>
                  <Select
                    labelId="teacher-label"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    label="Teacher"
                  >
                    {teacherOptions.map((option) => (
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
                <AccountTreeIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
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
                  {/* <InputLabel shrink>Students</InputLabel> */}
                  <Box 
                    onClick={handleStudentClick}
                    sx={{ 
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      p: 1,
                    //   mt: 1,
                      minHeight: '56px',
                      cursor: 'pointer'
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
                            <ListItem key={student} dense button onClick={() => handleStudentToggle(student)}>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={formData.students.indexOf(student) !== -1}
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
                <LocationOnIcon sx={{ mt: 4, mr: 1, color: 'text.secondary' }} />
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
                      minHeight: '40px'
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
                    <Box sx={{ 
                      p: 2, 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: 1 
                    }}>
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
                            border: formData.color === color.value ? '2px solid #000' : 'none',
                            '&:hover': {
                              opacity: 0.8
                            }
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
            textTransform: 'none'
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventForm;