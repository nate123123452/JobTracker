import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MultiDatePicker from 'react-multi-date-picker';
import { motion } from 'framer-motion';

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Fetch jobs from the backend
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/jobs/')
      .then((response) => {
        setJobs(response.data || []);
      })
      .catch((error) => {
        console.error('There was an error fetching the jobs!', error);
        setJobs([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrUpdateJob = (e) => {
    e.preventDefault();

    if (isEditing) {
      axios
        .put(`http://localhost:8000/api/jobs/${editingJobId}/`, formData)
        .then((response) => {
          const updatedJob = response.data;
          setJobs(
            jobs.map((job) =>
              job.id === editingJobId ? { ...updatedJob } : job
            )
          );
          setIsEditing(false);
          setEditingJobId(null);
        })
        .catch((error) => {
          console.error('Error updating job:', error);
        });
    } else {
      axios
        .post('http://localhost:8000/api/jobs/', formData)
        .then((response) => {
          setJobs([...jobs, response.data]);
        })
        .catch((error) => {
          console.error('Error adding job:', error);
        });
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

  const handleDeleteJob = (id) => {
    axios
      .delete(`http://localhost:8000/api/jobs/${id}/`)
      .then(() => {
        setJobs(jobs.filter((job) => job.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting job:', error);
      });
  };

  const handleEditJob = (id) => {
    const jobToEdit = jobs.find((job) => job.id === id);
    setFormData(jobToEdit);
    setIsEditing(true);
    setEditingJobId(id);
  };

  const handleInterviewDateChange = (dates) => {
    // Ensure dates is an array before calling map
    const formattedDates = Array.isArray(dates) ? dates : [dates];
    
    setFormData({
      ...formData,
      interview_dates: formattedDates.map((date) => date.format('YYYY-MM-DD')),
    });
  };
  

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        return (
          (job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterStatus === '' || job.status === filterStatus)
        );
      })
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="max-w-6xl mx-7 lg:mx-8 xl:mx-auto p-6 sm:p-8 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-8">Job Dashboard</h1>

      {/* Job Form */}
      <form onSubmit={handleAddOrUpdateJob} className="mb-8 bg-white p-6 rounded-lg shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-700">{isEditing ? 'Edit Job' : 'Add a New Job'}</h2>
        <div className="grid grid-cols-2 gap-6">
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <select name="status" value={formData.status} onChange={handleChange} className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
            <option value="">Select Status</option>
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select name="location" value={formData.location} onChange={handleChange} className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
            <option value="">Type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="In Person">In Person</option>
          </select>
          <input type="url" name="site" value={formData.site} onChange={handleChange} placeholder="Application Site URL" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="date" name="applied_date" value={formData.applied_date} onChange={handleChange} placeholder="Applied Date" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"></textarea>
          <div className="flex flex-col gap-4">
            <label className="text-lg font-semibold text-indigo-700">Interview Dates</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MultiDatePicker value={formData.interview_dates} onChange={handleInterviewDateChange} placeholder="Select Interview Dates" inputClass="w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="button" onClick={() => setFormData({ ...formData, interview_dates: [] })} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none">Clear</button>
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
                  <th className="p-3">Company</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Interview Dates</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-t border-gray-300">
                    <td className="p-3">{job.company}</td>
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.status}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{job.applied_date}</td>
                    <td className="p-3">{job.notes}</td>
                    <td className="p-3">{job.interview_dates ? job.interview_dates.join(', ') : 'N/A'}</td>
                    <td className="p-3 flex space-x-2">
                      <button onClick={() => handleEditJob(job.id)} className="text-blue-600 hover:text-blue-800 focus:outline-none">Edit</button>
                      <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-800 focus:outline-none">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700">No jobs found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default JobDashboard;
