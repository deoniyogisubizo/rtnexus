import React, { useState } from 'react';

import { Search, Briefcase, MapPin, Building, Lock, FileCheck, Check, Send, X } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { OpenPosition } from '../types';

interface CareersSectionProps {
  theme?: 'light' | 'dark';
}

export default function CareersSection({ theme = 'light' }: CareersSectionProps) {
  const isDark = theme === 'dark';
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<OpenPosition | null>(null);
  const [applied, setApplied] = useState(false);

  // Application Form States
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantResume, setApplicantResume] = useState('');
  const [coverNote, setCoverNote] = useState('');

  const departments = ['All', 'Engineering', 'Learning Paths', 'Media'];

  const allJobs: OpenPosition[] = [];

  const filteredJobs = allJobs.filter(job => {
    return selectedDept === 'All' || job.department === selectedDept;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;
    setApplied(true);
  };

  const handleOpenApplyModal = (job: OpenPosition) => {
    setSelectedJob(job);
    setApplied(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantResume('');
    setCoverNote('');
  };

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">

        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'Careers' },
          ]}
          theme={theme}
        />

        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold text-left">OPEN CAREERS PORTAL</p>
          <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 text-left">RTTI & NEXUS ASSOCIATE RECRUITING</h2>
        </div>

        {/* Introduction */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-left">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-2">Build Vetted Frameworks with RT</h3>
          <p className="text-xs text-gray-600 font-light leading-relaxed max-w-4xl">
            RT Nexus is deploying critical systems nodes around IoT grids, accredited university licensing tracks, and telemetry broadcast systems. We are recruiting experienced secure-element design investigators, educational curators, and high-frequency stream developers to join our centers.
          </p>
        </div>

        {/* Operations filter row */}
        <div className="flex flex-wrap border-b border-gray-200 pb-3 mb-6 gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`text-xs py-1.5 px-4 rounded-none transition-colors font-sans ${selectedDept === dept ? 'bg-[#3373AB] text-white font-semibold' : 'bg-gray-100 hover:bg-gray-205 text-gray-650'}`}
            >
              {dept} Positions
            </button>
          ))}
        </div>

        {/* Jobs Directory listing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 p-6 bg-white flex flex-col justify-between text-left group hover:border-[#3373AB] transition-colors">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">{job.id} • {job.department.toUpperCase()}</span>
                    <h4 className="font-bold font-sans text-xs sm:text-sm text-gray-950 uppercase tracking-tight mt-1 leading-snug group-hover:text-[#3373AB]">{job.title}</h4>
                  </div>
                  <span className="bg-[#111111] text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-wide whitespace-nowrap">{job.type}</span>
                </div>

                <div className="flex gap-4 text-[10px] font-mono mt-3 text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={10} />
                    Experience: {job.experience}
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-light mt-4 leading-relaxed font-sans line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center bg-transparent">
                <span className="text-[10px] text-gray-400 font-mono">POSTED 2D AGO</span>
                <button 
                  onClick={() => handleOpenApplyModal(job)}
                  className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-none transition-colors outline-none"
                >
                  Onboard Application
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL: APPLICATION DOSSIER */}
        {selectedJob && (
          <div className="fixed inset-0 bg-[#111111]/85 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full text-left rounded-none border border-gray-200 shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-[#3373AB] uppercase">APPLICANT SUBMISSION MATRIX</span>
                  <span className="text-xs font-bold font-sans uppercase tracking-tight mt-1">ROLE DOSSIER {selectedJob.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)} 
                  className="text-gray-400 hover:text-white outline-none cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-xs font-sans font-bold text-gray-900 uppercase">{selectedJob.title}</h3>
                  <p className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">Location: {selectedJob.location} • Tenure: {selectedJob.type}</p>
                </div>

                {!applied ? (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Full Legal Name</label>
                        <input 
                          type="text" 
                          placeholder="Applicant Name"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Corporate Email Address</label>
                        <input 
                          type="email" 
                          placeholder="Email"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">External Resume / CV Link</label>
                      <input 
                        type="url" 
                        placeholder="Link to PDF, Github, or LinkedIn profile"
                        value={applicantResume}
                        onChange={(e) => setApplicantResume(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Cover statement (Optional)</label>
                      <textarea 
                        rows={3}
                        placeholder="Briefly state your alignment with hardware secure elements, teaching sandboxes, or video stream architectures..."
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB] font-sans"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-2.5 transition-colors outline-none flex items-center justify-center gap-2"
                    >
                      <Send size={11} />
                      <span>Dispatch Application</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 text-emerald-800 p-5 text-center space-y-3">
                    <Check className="mx-auto text-emerald-600" size={24} />
                    <h4 className="font-sans font-bold text-xs uppercase text-gray-900">APPLICATION PACK INGESTED</h4>
                    
                    <p className="text-[11px] text-gray-600 leading-relaxed font-sans font-light">
                      Successfully logged the application profile for <span className="font-semibold">{applicantName}</span>. A secure RTTI recruitment coordinator has registered the resume variables and will emit a configuration message to <span className="font-semibold">{applicantEmail}</span> within 48 hours.
                    </p>
                    
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="mt-4 bg-[#111111] text-white py-1.5 px-4 font-mono text-[9px] uppercase tracking-wider rounded-none outline-none"
                    >
                      Close Dossier
                    </button>
                  </div>
                )}
              </div>

              {/* Requirements reminder pane */}
              <div className="bg-gray-50 border-t border-gray-200 p-4 font-mono text-[10px] text-gray-500">
                <span className="font-semibold text-gray-700 block uppercase mb-1">Minimum verification specs:</span>
                • Advanced C/C++ or ASM parameters. • G-1 Secure clearance capabilities. • 2 references logged on original corporate foundries.
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
