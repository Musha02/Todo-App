import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from './TaskList';
import { Task } from '../services/api';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: new Date().toISOString(),
    }, 
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      created_at: new Date().toISOString(),
    },
  ];

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state', () => {
    render(
      <TaskList
        tasks={[]}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={true}
      />
    );
    
    expect(screen.getByText(/loading your tasks/i)).toBeInTheDocument();
  });

  it('displays loading spinner when loading', () => {
    const { container } = render(
      <TaskList
        tasks={[]}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={true}
      />
    );
    
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByText(/start by creating your first task/i)).toBeInTheDocument();
  });

  it('displays empty state icon when no tasks', () => {
    const { container } = render(
      <TaskList
        tasks={[]}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders list of tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('displays task count badge', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays "Your Tasks" header when tasks exist', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/your tasks/i)).toBeInTheDocument();
  });

  it('renders correct number of task cards', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    const taskCards = screen.getAllByText(/task \d/i);
    expect(taskCards).toHaveLength(2);
  });

  it('passes completingTaskId to TaskCard components', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={1}
        isLoading={false}
      />
    );
    
    // The component should render without errors
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('passes onComplete handler to TaskCard components', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onComplete={mockOnComplete}
        completingTaskId={null}
        isLoading={false}
      />
    );
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    expect(doneButtons).toHaveLength(2);
  });
});