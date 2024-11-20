import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Ensure this is imported
import api from '../services/api'; // Import the api instance

// Localizer for Big Calendar
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get('/api/interview_dates/');
        const data = response.data;
        console.log('Fetched data:', data); // Debugging line
        const formattedEvents = data.map(interview => ({
          id: interview.id,
          title: `${interview.company} - ${interview.title}`,
          start: new Date(`${interview.date}T${interview.startTime || '00:00:00'}`),
          end: new Date(`${interview.date}T${interview.endTime || '23:59:59'}`),
          description: interview.description,
          location: interview.location,
        }));
        console.log('Formatted events:', formattedEvents); // Debugging line
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching interview dates:', error);
      }
    };

    fetchInterviews();
  }, []);

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

      {/* Placeholder for interviews */}
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">View and manage your upcoming interview dates.</p>
      </div>

      {/* Custom styles for the calendar */}
      <style>{`
        /* Dark Gray Borders for all Calendar Elements */
        
        /* For Month View */
        .rbc-month-view .rbc-day-bg {
          border-right: 1px solid #4A5568; /* Dark gray border between days */
          border-bottom: 2px solid #4A5568; /* Dark gray border between rows */
        }

        /* For Week and Day Views */
        .rbc-week-view .rbc-time-column,
        .rbc-week-view .rbc-day-slot,
        .rbc-day-view .rbc-time-column,
        .rbc-day-view .rbc-day-slot {
          border-right: 2px solid #4A5568; /* Dark gray border between time columns */
          border-bottom: 2px solid #4A5568; /* Dark gray border between time slots */
        }

        /* Header Row Styling for All Views (Day Names) */
        .rbc-header {
          background-color: #F7FAFC; /* Light background for header */
          font-weight: bold;
          color: #2D3748; /* Dark text for header */
          border-bottom: 2px solid #4A5568; /* Dark gray border under the header */
        }

        /* For Agenda View */
        .rbc-agenda-view .rbc-agenda-table tbody > tr > td {
          border-top: 2px solid #4A5568; /* Dark gray border between agenda items */
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

        /* Style for all-day events */
        .rbc-allday-cell .rbc-event {
          height: 20px; /* Reduce height */
          padding: 2px 6px; /* Add padding for compact look */
          background-color: #E2E8F0; /* Light gray background for all-day events */
          color: #2D3748; /* Dark text for better readability */
          border-radius: 4px; /* Rounded corners */
          border: 1px solid #A0AEC0; /* Light border */
          font-size: 0.875rem; /* Smaller font size */
          text-overflow: ellipsis; /* Add ellipsis if text is too long */
          white-space: nowrap; /* Prevent text overflow */
          overflow: hidden; /* Hide overflowing text */
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