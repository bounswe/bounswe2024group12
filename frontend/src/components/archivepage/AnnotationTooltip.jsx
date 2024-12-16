import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';

const AnnotationTooltip = ({ annotations, onDelete, onEdit, currentUser }) => {
  if (!annotations || annotations.length === 0) return null;

  return (
    <Box sx={{ p: 1, minWidth: 200 }}>
      {annotations.map((annotation) => (
        <Box 
          key={annotation.id} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            mb: 1 
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 0.5 
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 'bold' }}
            >
              {annotation.username}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start' 
          }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {annotation.text}
            </Typography>
            {annotation.username === currentUser && (
              <>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(annotation);
                  }}
                  sx={{ ml: 1 }}
                  aria-label="edit"
                >
                  <MdEdit />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(annotation.id);
                  }}
                  sx={{ ml: 1 }}
                  aria-label="delete"
                >
                  <MdDelete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AnnotationTooltip; 