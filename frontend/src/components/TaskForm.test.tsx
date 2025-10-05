import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('updates input values when typing', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descInput, { target: { value: 'New Description' } });
    
    expect(titleInput.value).toBe('New Task');
    expect(descInput.value).toBe('New Description');
  });

  it('calls onSubmit with form data when submitted', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('Test Task', 'Test Description');
  });

  it('clears form after submission', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const form = titleInput.closest('form') as HTMLFormElement;
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.submit(form);
    
    expect(titleInput.value).toBe('');
    expect(descInput.value).toBe('');
  });

  it('does not submit if title is empty', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const form = screen.getByLabelText(/task title/i).closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not submit if title contains only whitespace', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const form = titleInput.closest('form') as HTMLFormElement;
    
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.submit(form);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables button when isSubmitting is true', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('disables button when title is empty', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('enforces max length on title', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement;
    expect(titleInput).toHaveAttribute('maxLength', '255');
  });

  it('shows "Creating..." text when submitting', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });

  it('shows "Add Task" text when not submitting', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });
});