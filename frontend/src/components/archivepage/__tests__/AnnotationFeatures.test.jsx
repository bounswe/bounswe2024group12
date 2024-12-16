import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnnotationTooltip from '../AnnotationTooltip';
import AddAnnotationDialog from '../AddAnnotationDialog';

describe('AnnotationTooltip Component', () => {
  const mockAnnotations = [
    { id: 1, username: 'testUser', text: 'Test annotation 1' },
    { id: 2, username: 'otherUser', text: 'Test annotation 2' }
  ];
  
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  test('renders annotations correctly', () => {
    render(
      <AnnotationTooltip 
        annotations={mockAnnotations}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        currentUser="testUser"
      />
    );

    expect(screen.getByText('Test annotation 1')).toBeInTheDocument();
    expect(screen.getByText('Test annotation 2')).toBeInTheDocument();
    expect(screen.getByText('testUser')).toBeInTheDocument();
    expect(screen.getByText('otherUser')).toBeInTheDocument();
  });

  test('shows edit/delete buttons only for current user annotations', () => {
    render(
      <AnnotationTooltip 
        annotations={mockAnnotations}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        currentUser="testUser"
      />
    );

    // Count edit and delete buttons
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    // Should only show buttons for testUser's annotation
    expect(editButtons).toHaveLength(1);
    expect(deleteButtons).toHaveLength(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <AnnotationTooltip 
        annotations={mockAnnotations}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        currentUser="testUser"
      />
    );

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <AnnotationTooltip 
        annotations={mockAnnotations}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        currentUser="testUser"
      />
    );

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockAnnotations[0]);
  });
});

describe('AddAnnotationDialog Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders add annotation dialog correctly', () => {
    render(
      <AddAnnotationDialog 
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        stepIndex={0}
      />
    );

    expect(screen.getByText('Add Annotation')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByLabelText(/Annotation for Move 1/i)).toBeInTheDocument();
  });

  test('renders edit annotation dialog with existing text', () => {
    const editAnnotation = { id: 1, text: 'Existing annotation' };
    
    render(
      <AddAnnotationDialog 
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        stepIndex={0}
        editAnnotation={editAnnotation}
      />
    );

    expect(screen.getByText('Edit Annotation')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing annotation')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('submits new annotation correctly', async () => {
    render(
      <AddAnnotationDialog 
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        stepIndex={0}
      />
    );

    const input = screen.getByLabelText(/Annotation for Move 1/i);
    await userEvent.type(input, 'New annotation text');
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(0, 'New annotation text', undefined);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not submit empty annotation', async () => {
    render(
      <AddAnnotationDialog 
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        stepIndex={0}
      />
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('closes dialog when cancel is clicked', () => {
    render(
      <AddAnnotationDialog 
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        stepIndex={0}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 