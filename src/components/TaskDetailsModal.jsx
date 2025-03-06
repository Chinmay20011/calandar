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
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';

const TaskDetailsModal = ({ open, onClose, task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);

    // Initialize edited task when task changes
    React.useEffect(() => {
        if (task) {
            setEditedTask({...task});
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