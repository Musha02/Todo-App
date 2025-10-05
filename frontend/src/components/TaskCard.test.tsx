import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from './TaskCard';
import { Task } from '../services/api';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: new Date().toISOString(),
  };

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} isCompleting={false} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders without description if not provided', () => {
    const taskWithoutDesc = { ...mockTask, description: '' };
    render(<TaskCard task={taskWithoutDesc} onComplete={mockOnComplete} isCompleting={false} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} isCompleting={false} />);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  it('disables button when isCompleting is true', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} isCompleting={true} />);
    
    const doneButton = screen.getByRole('button');
    expect(doneButton).toBeDisabled();
  });

  it('displays formatted date', () => {
    const { container } = render(
      <TaskCard task={mockTask} onComplete={mockOnComplete} isCompleting={false} />
    );
    
    expect(container.textContent).toMatch(/\w+ \d+, \d{4}/);
  });
});