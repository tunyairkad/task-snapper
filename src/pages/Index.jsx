import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskList from '../components/TaskList';
import { addTask } from '../utils/taskUtils';
import { initializeGoogleAuth, signIn, isSignedIn, createGoogleCalendarEvent } from '../utils/googleCalendar';
import { toast } from 'sonner';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState();
  const [description, setDescription] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initGoogle = async () => {
      setIsLoading(true);
      try {
        const initialized = await initializeGoogleAuth();
        setIsLoggedIn(isSignedIn());
        setIsInitialized(initialized);
        if (initialized) {
          toast.success('Google Auth initialized successfully');
        } else {
          toast.error('Failed to initialize Google Auth. Please check your internet connection and try again.');
        }
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        toast.error(`Failed to initialize Google Auth: ${error.message}`);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };
    initGoogle();
  }, []);

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      toast.error('Google Auth is not initialized. Please refresh the page and try again.');
      return;
    }
    setIsLoading(true);
    try {
      const signedIn = await signIn();
      setIsLoggedIn(signedIn);
      if (signedIn) {
        toast.success('Successfully signed in with Google!');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(`An error occurred while signing in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (date && description.trim() && isLoggedIn) {
      try {
        const eventSummary = `${description} // due ${format(date, 'PPP')}`;
        await createGoogleCalendarEvent(eventSummary, date);
        const newTask = addTask(date, description);
        setTasks([...tasks, newTask]);
        setDate(undefined);
        setDescription('');
        toast.success('Task added successfully to Google Calendar!');
      } catch (error) {
        console.error('Error adding task to Google Calendar:', error);
        toast.error(`Failed to add task to Google Calendar: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Quick Task Creator</h1>
        {!isLoggedIn ? (
          <div className="mb-4">
            <Button onClick={handleGoogleLogin} disabled={isLoading || !isInitialized}>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            {!isInitialized && (
              <p className="text-sm text-red-500 mt-2">
                Google Auth initialization failed. Please refresh the page and try again.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <Input
              type="text"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddTask} disabled={!date || !description.trim()} className="w-full">
              Add Task to Google Calendar
            </Button>
          </div>
        )}
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default Index;
