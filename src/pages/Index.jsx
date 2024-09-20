import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskList from '../components/TaskList';
import { addTask } from '../utils/taskUtils';
import { GoogleLogin } from '@react-oauth/google';
import { initializeGoogleAuth, createGoogleCalendarEvent } from '../utils/googleCalendar';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState();
  const [description, setDescription] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = (credentialResponse) => {
    initializeGoogleAuth(credentialResponse.access_token);
    setIsLoggedIn(true);
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
      } catch (error) {
        console.error('Error adding task to Google Calendar:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Quick Task Creator</h1>
        {!isLoggedIn ? (
          <div className="mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
            />
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
