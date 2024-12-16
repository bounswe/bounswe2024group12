import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const AddAnnotationDialog = ({ open, onClose, onSubmit, stepIndex, editAnnotation = null }) => {
  const [annotationText, setAnnotationText] = useState('');

  useEffect(() => {
    if (editAnnotation) {
      setAnnotationText(editAnnotation.text);
    } else {
      setAnnotationText('');
    }
  }, [editAnnotation]);

  const handleSubmit = () => {
    if (annotationText.trim() !== '') {
      onSubmit(stepIndex, annotationText, editAnnotation?.id);
      setAnnotationText('');
      onClose();
    }
  };

  return (
    <Dialog 
      maxWidth="sm"
      fullWidth
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>{editAnnotation ? 'Edit Annotation' : 'Add Annotation'}</DialogTitle>
      <DialogContent sx={{ minHeight: '200px' }}>
        <TextField
          autoFocus
          margin="dense"
          label={`Annotation for Move ${stepIndex + 1}`}
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={annotationText}
          onChange={(e) => setAnnotationText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editAnnotation ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnnotationDialog; 