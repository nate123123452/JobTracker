import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt } from 'react-icons/fa';

const Resume = () => {
  // Temporary sample data for uploaded resumes
  const uploadedResumes = [
    { id: 1, title: 'Resume 1', date: '2024-11-07', image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Resume 2', date: '2024-11-06', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <motion.div
      className="max-w-6xl mx-5 lg:mx-8 xl:mx-auto p-6 sm:p-8 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-800">Resume Dashboard</h1>

      {/* Upload Resume Section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">Upload Your Resume</h2>
        <div className="flex justify-center">
          <div className="border-dashed border-4 border-indigo-300 rounded-xl px-6 py-12 w-full max-w-md flex flex-col items-center mb-4 transition-all duration-300 hover:bg-indigo-50">
            <FaCloudUploadAlt className="text-indigo-500 mb-3" size={50} />
            <p className="text-indigo-500 text-center">Drag and drop or click to upload</p>
          </div>
        </div>
        <button className="bg-indigo-600 text-white font-semibold py-3 px-6 mt-6 mx-auto block rounded-lg w-full max-w-xs transition-all duration-300 hover:bg-indigo-700">
          Add Resume
        </button>
      </div>

      {/* Display Uploaded Resumes */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Uploaded Resumes</h2>
        <div className="grid gap-6 gril-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {uploadedResumes.map((resume) => (
            <div
              key={resume.id}
              className="p-4 border border-gray-200 rounded-lg flex flex-col items-center bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <img
                src={resume.image}
                alt={resume.title}
                className="w-32 h-32 object-cover mb-4 rounded-md"
              />
              <h3 className="text-lg font-semibold text-indigo-800">{resume.title}</h3>
              <p className="text-indigo-500">Uploaded on: {resume.date}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Resume;
