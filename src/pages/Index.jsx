import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskList from '../components/TaskList';
import { addTask } from '../utils/taskUtils';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState();

  const handleAddTask = () => {
    if (date) {
      const newTask = addTask(date);
      setTasks([...tasks, newTask]);
      setDate(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Quick Task Creator</h1>
        <div className="flex items-center space-x-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
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
          <Button onClick={handleAddTask} disabled={!date}>Add Task</Button>
        </div>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default Index;
