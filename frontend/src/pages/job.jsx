import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the api instance
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import moment from 'moment';

const JobDashboard = () => {
  // State to manage list of jobs
  const [jobs, setJobs] = useState([]);

  // State to manage search term and filter status
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // State to manage editing jobs
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // State to manage visible interviews and jobs
  const [visibleInterviews, setVisibleInterviews] = useState({});
  const [visibleJobs, setVisibleJobs] = useState(10);

  // State to manage adding/editing jobs
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    status: '',
    site: '',
    applied_date: '',
    location: '',
    notes: '',
    interview_dates: [],
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/api/jobs/');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  // Function that updates the form data when input fields change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are included
    const requiredFields = ['company', 'title', 'status', 'location'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    // Remove applied_date if it's empty
    const data = { ...formData };
    if (!data.applied_date) {
      delete data.applied_date;
    }

    // If editing, update the job, otherwise add a new job
    if (isEditing) {
      try {
        const response = await api.put(`/api/jobs/${editingJobId}/`, data);
        const updatedJob = response.data;
        setJobs(
          jobs.map((job) =>
            job.id === editingJobId ? { ...updatedJob } : job
          )
        );
        setIsEditing(false);
        setEditingJobId(null);
        toast.success('Job updated successfully!');
      } catch (error) {
        console.error('Error updating job:', error);
      }
    } 
    try {
      const response = await api.post('/api/jobs/', data);
      console.log('Response:', response.data); // Log the response
      setJobs([...jobs, response.data]);
      toast.success('Job added successfully!');
    } catch (error) {
      console.error('Error adding job:', {
        message: error.message,
        response: error.response, // Log the full response
        request: error.request,
        config: error.config,
      });      toast.error('Login To Add a Job');
    }

    setFormData({
      company: '',
      title: '',
      status: '',
      site: '',
      applied_date: '',
      location: '',
      notes: '',
      interview_dates: [],
    });
  };

  // Function to delete a job
  const handleDeleteJob = async (id) => {
    try {
      await api.delete(`/api/jobs/${id}/`);
      setJobs(jobs.filter((job) => job.id !== id));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Function to edit a job
  const handleEditJob = (id) => {
    const jobToEdit = jobs.find((job) => job.id === id);
    window.scrollTo(0, 0);
    toast.info('Editing job...');
    setFormData({
      ...jobToEdit,
      interview_dates: jobToEdit.interview_dates || [],
    });
    setIsEditing(true);
    setEditingJobId(id);
  };

  // Function to handle interview date changes
  const handleInterviewDateChange = (index, field, value) => {
    const updatedInterviewDates = formData.interview_dates.map((interview, i) => {
      if (i === index) {
        return { ...interview, [field]: value };
      }
      return interview;
    });
    setFormData({ ...formData, interview_dates: updatedInterviewDates });
  };

  // Function to add an interview date
  const addInterviewDate = () => {
    setFormData({
      ...formData,
      interview_dates: [
        ...formData.interview_dates,
        { description: 'N/A', date: '', startTime: '00:00', endTime: '00:00', location: 'TBD' },
      ],
    });
    toast.info('Interview date added successfully!');
  };

  // Function to remove an interview date
  const removeInterviewDate = (index) => {
    const updatedInterviewDates = formData.interview_dates.filter((_, i) => i !== index);
    setFormData({ ...formData, interview_dates: updatedInterviewDates });
    toast.info('Interview date removed successfully!');
  };

  // Function to toggle interviews visibility
  const toggleInterviewsVisibility = (jobId) => {
    setVisibleInterviews((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId],
    }));
  };

  // Filter jobs based on search term and status
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        return (
          (job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterStatus === '' || job.status === filterStatus)
        );
      })
    : [];

  // Function to load more jobs
  const loadMoreJobs = () => {
    setVisibleJobs((prevVisibleJobs) => prevVisibleJobs + 10);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="max-w-6xl mx-7 lg:mx-8 xl:mx-auto p-6 sm:p-8 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-lg shadow-lg"
      style={{ marginTop: '6rem' }}
    >
      <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-8">Job Dashboard</h1>

      {/* Job Form */}
      <form onSubmit={handleFormSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-700">{isEditing ? 'Edit Job' : 'Add a New Job'}</h2>
        <div className="grid grid-cols-2 gap-6">
          <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Company Name" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Job Title" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <select name="status" value={formData.status} onChange={handleInputChange} className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
            <option value="">Select Status</option>
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select name="location" value={formData.location} onChange={handleInputChange} className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
            <option value="">Type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="In Person">In Person</option>
          </select>
          <input type="url" name="site" value={formData.site} onChange={handleInputChange} placeholder="Application Site URL" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input 
            type="text" 
            onFocus={(e) => e.target.type = 'date'} 
            onBlur={(e) => {
              e.target.type = 'text';
              if (e.target.value) {
                e.target.value = moment(e.target.value).format('MM-DD-YYYY');
              }
            }}
            name="applied_date" 
            value={formData.applied_date} 
            onChange={handleInputChange} 
            id="date" 
            placeholder="Applied Date" 
            className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"></textarea>

          {/* Interview Dates */}
          <div className="sm:col-span-2">
            <label className="text-lg font-semibold text-indigo-700 text-center block">Interview Dates</label>
            {formData.interview_dates.map((interview, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 overflow-auto">Description</label>
                  <textarea
                    name="description"
                    value={interview.description}
                    onChange={(e) => handleInterviewDateChange(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Interview Date</label>
                  <input
                    type="date"
                    value={interview.date}
                    onChange={(e) => handleInterviewDateChange(index, 'date', e.target.value)}
                    placeholder="Interview Date"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={interview.startTime}
                    onChange={(e) => handleInterviewDateChange(index, 'startTime', e.target.value)}
                    placeholder="Start Time"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={interview.endTime}
                    onChange={(e) => handleInterviewDateChange(index, 'endTime', e.target.value)}
                    placeholder="End Time"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={interview.location}
                    onChange={(e) => handleInterviewDateChange(index, 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <button
                    type="button"
                    onClick={() => removeInterviewDate(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none w-full flex justify-center"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={addInterviewDate}
                className="bg-indigo-600 text-white px-4 py-2 my-2 rounded-lg flex items-center hover:bg-indigo-700 focus:outline-none"
              >
                Add Interview Date
              </button>
            </div>  
          </div>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{isEditing ? 'Update Job' : 'Add Job'}</button>
      </form>

      {/* Job List */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Job List</h2>
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Company or Title" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-1/3" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-1/3">
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {filteredJobs.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-3">#</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Interview Dates</th>
                  <th className="p-3">Application Site URL</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Display the first 10 jobs */}
                {filteredJobs.slice(0, visibleJobs).map((job, index) => (
                  <tr key={job.id} className="border-t border-gray-300">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{job.company}</td>
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.status}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{moment(job.applied_date).format('MMMM DD, YYYY')}</td>
                    <td className="p-3 overflow-auto whitespace-pre ">{job.notes}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <button
                          onClick={() => toggleInterviewsVisibility(job.id)}
                          className="text-indigo-600 hover:text-indigo-800 focus:outline-none mb-2 custom-button"
                        >
                          {visibleInterviews[job.id] ? 'Hide Interviews' : 'Show Interviews'}
                        </button>
                        {/* Display interviews if visible */}
                        {visibleInterviews[job.id] && (
                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            {job.interview_dates.map((interview, index) => {
                              const startTime = new Date(`1970-01-01T${interview.startTime}`);
                              const endTime = new Date(`1970-01-01T${interview.endTime}`);
                              return (
                                <div key={index} className="mb-2 border-b border-gray-200 pb-2">
                                  <p className="text-sm"><strong>Description:</strong> {interview.description}</p>
                                  <p className="text-sm"><strong>Date:</strong> {new Date(new Date(interview.date).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                  <p className="text-sm"><strong>Start:</strong> {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                  <p className="text-sm"><strong>End:</strong> {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                  <p className="text-sm"><strong>Location:</strong> {interview.location}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3"><a href={job.site} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">{job.site}</a></td>
                    <td className="p-3 flex space-x-2">
                      <button onClick={() => handleEditJob(job.id)} className="text-blue-600 hover:text-blue-800 focus:outline-none">Edit</button>
                      <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-800 focus:outline-none">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleJobs < filteredJobs.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreJobs}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-700">No jobs found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default JobDashboard;