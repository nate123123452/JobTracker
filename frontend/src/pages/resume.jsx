import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaDownload, FaTrashAlt } from 'react-icons/fa';
import api from '../services/api'; // Import the api instance
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Resume = () => {
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document: null,
    fileName: '',
  });
  const fileInputRef = useRef(null);

  const zoomPluginInstance = zoomPlugin();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/api/resumes/');
        setUploadedResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };
    fetchResumes();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      console.log("File selected:", file); // Debugging
      setFormData((prevData) => ({ ...prevData, document: file, fileName: file.name }));
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();  // Prevent default behavior (open as link for some elements)
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prevData) => ({ ...prevData, document: file, fileName: file.name }));
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow a drop
  };

  const handleDivClick = (e) => {
    e.preventDefault(); // Prevent default behavior (open as link for some elements)
    e.stopPropagation(); // Stop event propagation
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.document) {
      alert('Please provide a title and upload a document.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description || 'N/A');
    data.append('document', formData.document);

    try {
      const response = await api.post('/api/upload_resume/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedResumes((prevResumes) => [
        ...prevResumes,
        {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          date: new Date(response.data.upload_date).toLocaleDateString(),
          document: URL.createObjectURL(formData.document),
          fileName: formData.fileName,
        },
      ]);
      toast.success('Resume uploaded successfully!', { autoClose: 1500 });

      setFormData({ title: '', description: '', document: null, fileName: '' });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Login To Upload a Resume');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/resumes/${id}/`);
      setUploadedResumes((prevResumes) => prevResumes.filter((resume) => resume.id !== id));
      toast.success('Resume deleted successfully!', { autoClose: 1500 });
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
  }

  return (
    <motion.div
      className="max-w-6xl mx-5 lg:mx-8 xl:mx-auto p-6 sm:p-8 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-800">Resume Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">Upload Your Resume</h2>
        <div className="flex flex-col items-center">
          <input
            type="text"
            name="title"
            placeholder="Resume Title"
            value={formData.title}
            onChange={handleInputChange}
            className="mb-4 p-2 border border-indigo-300 rounded-md w-full max-w-md"
          />
          <textarea
            name="description"
            placeholder="Resume Description (Optional)"
            value={formData.description}
            onChange={handleInputChange}
            className="mb-4 p-2 border border-indigo-300 rounded-md w-full max-w-md"
          />
          <div
            className="border-dashed border-4 border-indigo-300 rounded-xl px-6 py-12 w-full max-w-md flex flex-col items-center mb-4 transition-all duration-300 hover:bg-indigo-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleDivClick}
          >
            <FaCloudUploadAlt className="text-indigo-500 mb-3" size={50} />
            <p className="text-indigo-500 text-center">Drag and drop</p>
            <p className="text-indigo-500 text-center">PDF Files only</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="application/pdf"
            />
            {formData.fileName && (
              <div className="mt-4 p-4 border border-green-500 rounded-md bg-green-50 text-green-700">
                <p className="font-semibold">File Added:</p>
                <p>{formData.fileName}</p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 mt-6 rounded-lg w-full max-w-xs transition-all duration-300 hover:bg-indigo-700"
          >
            Add Resume
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Uploaded Resumes</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {uploadedResumes.map((resume) => (
            <div
              key={resume.id}
              className="p-4 border border-gray-200 rounded-lg flex flex-col items-center bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-full h-96 mb-4 rounded-md overflow-hidden">
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                  <Viewer fileUrl={resume.document} defaultScale={0.5} plugins={[zoomPluginInstance]} />
                </Worker>
              </div>
              <h3 className="text-lg font-semibold text-indigo-800">{resume.title}</h3>
              <p className="text-indigo-500">Uploaded on: {resume.date}</p>
              <p className="text-indigo-600 text-center">{resume.description}</p>
              <a
                href={resume.document}
                download={resume.fileName}
                className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-indigo-700 flex items-center"
              >
                <FaDownload className="mr-2" />
                Download
              </a>
              <button
                onClick={() => handleDelete(resume.id)}
                className="mt-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-700 flex items-center"
              >
                <FaTrashAlt className="mr-2" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Resume;