import React, { useState, useEffect } from 'react';
import { taskApi, Task } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await taskApi.createTask({ title, description });
      await fetchTasks();
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (id: number) => {
    try {
      setCompletingTaskId(id);
      setError(null);
      await taskApi.completeTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setSuccessMessage('Task completed! Well done!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error('Error completing task:', err);
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-1 mb-6">
            <div className="bg-white rounded-xl px-6 py-3 animate-pop-in">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent animate-pulse-slow">
                Todo App
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Organize your tasks and boost your productivity
          </p>
        </header>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg flex items-start gap-3 animate-slide-down">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
                1.414L8.586 10l-1.293 1.293a1 1 0 
                101.414 1.414L10 11.414l1.293 1.293a1 
                1 0 001.414-1.414L11.414 10l1.293-1.293a1 
                1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 
                  8.586l4.293-4.293a1 1 0 
                  111.414 1.414L11.414 10l4.293 
                  4.293a1 1 0 01-1.414 1.414L10 
                  11.414l-4.293 4.293a1 1 0 
                  01-1.414-1.414L8.586 10 
                  4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-start gap-3 animate-slide-down">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 
                000 16zm3.707-9.293a1 1 0 
                00-1.414-1.414L9 10.586 7.707 
                9.293a1 1 0 00-1.414 1.414l2 
                2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Task Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all ">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 ">Add New Task</h2>
            <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
          </div>

          {/* Right Column - Task List */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            {/* <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent task</h2> */}
            <TaskList
              tasks={tasks}
              onComplete={handleCompleteTask}
              completingTaskId={completingTaskId}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2025 Created by Ahamed Musharraf. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
