import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Box, 
    TextField,
    Grid,
    IconButton,
    Divider,
    Switch,
    FormControlLabel,
    Paper,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';

const TaskDetailsModal = ({ open, onClose, task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);

    // Initialize edited task when task changes
    React.useEffect(() => {
        if (task) {
            const initialTask = {...task};
            // Convert students to objects with name and attendance
            initialTask.students = (initialTask.students || []).map(student => ({
                name: typeof student === 'object' ? student.name : student,
                attendance: (student && typeof student === 'object' && student.attendance) || 'absent'
            }));
            setEditedTask(initialTask);
        }
    }, [task]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = () => {
        onUpdate(editedTask);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    // Handle attendance toggle for a student
    const handleAttendanceToggle = (studentName) => {
        setEditedTask(prev => ({
            ...prev,
            students: prev.students.map(student => 
                student.name === studentName
                    ? { ...student, attendance: student.attendance === 'present' ? 'absent' : 'present' }
                    : student
            )
        }));
    };

    // If task is null or undefined, don't render the modal
    if (!task) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '8px',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    backgroundColor: task.color,
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2
                }}
            >
                {isEditing ? (
                    <TextField
                        name="title"
                        value={editedTask.title}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ 
                            input: { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffff',
                                },
                            }
                        }}
                    />
                ) : (
                    <Typography variant="h6">{task.title}</Typography>
                )}
                <Box>
                    {!isEditing && (
                        <IconButton onClick={handleEditToggle} sx={{ color: '#ffffff', mr: 1 }}>
                            <EditIcon />
                        </IconButton>
                    )}
                    <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <EventIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="date"
                                        type="date"
                                        value={editedTask.date ? new Date(editedTask.date).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        size="small"
                                        fullWidth
                                    />
                                ) : (
                                    <Typography variant="body1">{formatDate(task.date)}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Start Time</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="startTime"
                                        type="time"
                                        value={editedTask.startTime}
                                        onChange={handleInputChange}
                                        size="small"
                                        fullWidth
                                    />
                                ) : (
                                    <Typography variant="body1">{task.startTime}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">End Time</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="endTime"
                                        type="time"
                                        value={editedTask.endTime}
                                        onChange={handleInputChange}
                                        size="small"
                                        fullWidth
                                    />
                                ) : (
                                    <Typography variant="body1">{task.endTime}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Student Attendance Section */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 2 }}>
                            <PeopleIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Student Attendance
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Toggle to mark attendance
                                    </Typography>
                                </Box>
                                
                                {editedTask?.students && editedTask.students.length > 0 ? (
                                    <Paper 
                                        variant="outlined" 
                                        sx={{ 
                                            mt: 1, 
                                            borderRadius: '8px',
                                            bgcolor: 'background.paper',
                                            '& .MuiListItem-root:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <List disablePadding>
                                            {editedTask.students.map((student, index) => (
                                                <React.Fragment key={student.name}>
                                                    <ListItem 
                                                        sx={{ 
                                                            py: 1,
                                                            borderBottom: index < editedTask.students.length - 1 
                                                                ? '1px solid rgba(0, 0, 0, 0.12)' 
                                                                : 'none',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        secondaryAction={
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={student.attendance === 'present'}
                                                                        onChange={() => handleAttendanceToggle(student.name)}
                                                                        color="success"
                                                                        sx={{
                                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                                color: 'success.main'
                                                                            },
                                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                                backgroundColor: 'success.main'
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        sx={{ 
                                                                            fontWeight: 'bold',
                                                                            color: student.attendance === 'present' ? 'success.main' : 'error.main',
                                                                            minWidth: '20px',
                                                                            transition: 'color 0.2s'
                                                                        }}
                                                                    >
                                                                        {student.attendance === 'present' ? 'P' : 'A'}
                                                                    </Typography>
                                                                }
                                                                labelPlacement="start"
                                                            />
                                                        }
                                                    >
                                                        <ListItemText 
                                                            primary={student.name}
                                                            primaryTypographyProps={{
                                                                variant: 'body1',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </ListItem>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Paper>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        No students assigned to this event.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {task.location && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <LocationOnIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                    {isEditing ? (
                                        <TextField
                                            name="location"
                                            value={editedTask.location}
                                            onChange={handleInputChange}
                                            size="small"
                                            fullWidth
                                        />
                                    ) : (
                                        <Typography variant="body1">{task.location}</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {task.teacher && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <PersonIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Teacher</Typography>
                                    {isEditing ? (
                                        <TextField
                                            name="teacher"
                                            value={editedTask.teacher}
                                            onChange={handleInputChange}
                                            size="small"
                                            fullWidth
                                        />
                                    ) : (
                                        <Typography variant="body1">{task.teacher}</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                            <SubjectIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="description"
                                        value={editedTask.description || ''}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                        size="small"
                                        fullWidth
                                    />
                                ) : (
                                    <Typography variant="body1">{task.description || 'No description provided'}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="inherit">Cancel</Button>
                        <Button onClick={handleUpdate} variant="contained" color="primary">Save Changes</Button>
                    </>
                ) : (
                    <>
                        <Button 
                            onClick={handleDelete} 
                            color="error" 
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                        <Button 
                            onClick={handleEditToggle} 
                            color="primary" 
                            variant="contained"
                            startIcon={<EditIcon />}
                        >
                            Edit
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailsModal;