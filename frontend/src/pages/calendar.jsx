import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Ensure this is imported

// Localizer for Big Calendar
const localizer = momentLocalizer(moment);

// Sample events
const events = [
  {
    id: 0,
    title: 'Interview with Company A',
    allDay: true,
    start: new Date(2024, 10, 12),
    end: new Date(2024, 10, 12),
    description: 'This is a full-day interview scheduled with Company A. Bring your resume.',
    location: 'Company A Headquarters',
  },
  {
    id: 1,
    title: 'Interview with Company B',
    start: new Date(2024, 10, 18, 10, 0), // 10:00 AM
    end: new Date(2024, 10, 18, 11, 30),  // 11:30 AM
    description: 'A technical interview with Company B. Prepare for coding challenges.',
    location: 'Company B Office',
  },
];

const CalendarView = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handler when an event is clicked
  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Store the selected event's details
  };

  return (
    <motion.div
      className="max-w-6xl mx-5 lg:mx-8 xl:mx-auto p-6 sm:p-8 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-800">Calendar Dashboard</h1>

      {/* Calendar View */}
      <div className="calendar-container mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: '80vh',
            minHeight: '500px',
          }}
          className="rounded-lg shadow-lg border border-gray-400"
          onSelectEvent={handleSelectEvent} // Trigger event details on click
        />
      </div>

      {/* Event Details Section */}
      {selectedEvent && (
        <div className="event-details mt-8 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-indigo-700">{selectedEvent.title}</h2>
          <p className="text-sm text-gray-500">{`Start: ${moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}`}</p>
          <p className="text-sm text-gray-500">{`End: ${moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}`}</p>
          <div className="mt-4">
            <p className="text-lg font-semibold text-indigo-600">Description:</p>
            <p className="text-gray-700">{selectedEvent.description}</p>
          </div>
          <div className="mt-4">
            <p className="text-lg font-semibold text-indigo-600">Location:</p>
            <p className="text-gray-700">{selectedEvent.location}</p>
          </div>
        </div>
      )}

      {/* Placeholder for interviews (you will fetch this later) */}
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">View and manage your upcoming interview dates.</p>
      </div>

      {/* Custom styles for the calendar */}
      <style jsx>{`
        /* Dark Gray Borders for all Calendar Elements */
        
        /* For Month View */
        .rbc-month-view .rbc-day-bg {
          border-right: 1px solid #4A5568; /* Dark gray border between days */
          border-bottom: 2px solid #4A5568; /* Dark gray border between rows */
        }

        /* For Week View */
        .rbc-week-view .rbc-time-column,
        .rbc-week-view .rbc-day-slot {
          border-right: 2px solid #4A5568; /* Dark gray border */
          border-bottom: 2px solid #4A5568; /* Dark gray border between days */
        }

        /* For Day View */
        .rbc-day-view .rbc-time-column,
        .rbc-day-view .rbc-day-slot {
          border-right: 2px solid #4A5568; /* Dark gray border */
          border-bottom: 2px solid #4A5568; /* Dark gray border between time slots */
        }

        /* For Header Row (Day Names) */
        .rbc-month-view .rbc-header,
        .rbc-week-view .rbc-header,
        .rbc-day-view .rbc-header {
          background-color: #F7FAFC; /* Light background for the header */
          font-weight: bold;
          color: #2D3748; /* Dark text for the header */
          border-bottom: 2px solid #4A5568; /* Dark gray border under the header */
        }

        /* Event Styling - Smaller Boxes */
        .rbc-event {
          background-color: #E2E8F0; /* Lighter gray background for events */
          color: #2D3748; /* Dark text for events */
          border-radius: 5px;
          border: 1px solid #A0AEC0; /* Border color */
          padding: 2px 6px; /* Reduce padding */
          font-size: 0.875rem; /* Smaller font size */
          white-space: nowrap; /* Prevent text overflow */
          overflow: hidden; /* Hide overflowing text */
          text-overflow: ellipsis; /* Add ellipsis if text is too long */
        }

        /* Optional: Hover effect for events */
        .rbc-event:hover {
          background-color: #CBD5E0; /* Slightly darker gray on hover */
          cursor: pointer;
        }

        /* Optional: Change the size of the event box in all views */
        .rbc-month-view .rbc-event, 
        .rbc-week-view .rbc-event, 
        .rbc-day-view .rbc-event {
          height: 30px; /* Control event box height */
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarView;
