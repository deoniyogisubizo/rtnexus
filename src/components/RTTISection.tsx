import { useState } from 'react';
import { Award, BookOpen, Clock, Play, GraduationCap, CheckCircle, Video, List, HelpCircle, Star, Shield, ArrowRight, User } from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data/mockData';

interface RTTISectionProps {
  searchQuery: string;
  theme?: 'light' | 'dark';
}

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIdx: number;
}

const MOCK_QUIZZES: Record<string, Question[]> = {
  'course-001': [
    {
      id: 1,
      questionText: 'Which mechanism prevents priority inversion under FreeRTOS schedulers?',
      options: ['Priority Inheritance Protocol', 'Round-Robin Time-Slicing', 'Mutually Assured Priority Promotion', 'Hardware Level Cache Lock'],
      correctIdx: 0
    },
    {
      id: 2,
      questionText: 'Under heavy DMA burst stresses, which element arbitrates access to the AHB system bus?',
      options: ['System Controller', 'Bus Matrix Arbiter', 'Symmetric RAM Bank Controller', 'Direct Interconnect Router'],
      correctIdx: 1
    }
  ],
  'course-003': [
    {
      id: 1,
      questionText: 'How does Neural Mesh Pruning affect edge visual inference payloads?',
      options: ['It doubles floating point register allocation', 'It deletes high-weight redundances to reduce inference latency', 'It strictly increases accuracy bounds on low-resolution streams', 'It requires an active external network transceiver module'],
      correctIdx: 1
    },
    {
      id: 2,
      questionText: 'What is the primary operational constraint of TensorFlow Lite on microcontrollers?',
      options: ['Absolute lack of dynamic heap allocations after boot', 'Requirement of minimum 512KB L1 cache capacity', 'Total restriction against integer-only quantization logic', 'Inability to compile on standard GCC toolchains'],
      correctIdx: 0
    }
  ]
};

export default function RTTISection({ searchQuery, theme = 'light' }: RTTISectionProps) {
  const isDark = theme === 'dark';
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'video' | 'quiz'>('syllabus');
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState('');
  
  // Quiz Simulation State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Filtercourses
  const filteredCourses = COURSES.filter(course => {
    const matchesQuery = 
      course.title.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      course.category.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      course.instructor.toLowerCase().includes((searchQuery || localSearch).toLowerCase());
    return matchesQuery;
  });

  const handleStartVideo = () => {
    setVideoPlaying(true);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setVideoPlaying(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveTab('syllabus');
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const activeCourseQuiz = MOCK_QUIZZES[selectedCourse.id];

  const scoreNum = activeCourseQuiz?.reduce((acc, q) => {
    if (quizAnswers[q.id] === q.correctIdx) return acc + 1;
    return acc;
  }, 0) || 0;

  const trendingSkills = ['Embedded RTOS Schedulers', 'TensorRL Tensor Quantization', 'SCADA Vulnerability Securing', 'RF Impedance Calibrating', 'OTA Boot Dual-Banking Routing'];

  const learningPaths = [
    { name: 'Industrial Dev Core (ID-C)', coursesCount: 3, estimate: '90 Hours', desc: 'Syllabus training covering microarchitectures, RTOS core, and bus matrix layouts.' },
    { name: 'SCADA Networks Defense Lead', coursesCount: 2, estimate: '60 Hours', desc: 'Advanced threat assessment on OT networks, cryptography modules, and Modbus defense.' },
    { name: 'Edge Machine Intelligence', coursesCount: 4, estimate: '120 Hours', desc: 'Specialized pipeline quantization, convolutional vision flows, and hardware accelerator compiling.' }
  ];

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10">
          <p className="text-[10px] font-mono font-bold tracking-widest text-[#3373AB]">RTTI ACADEMY & RESEARCH</p>
          <h2 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>REAL-WORLD CERTIFICATIONS FOR SYSTEMS ENGINEERING</h2>
        </div>

        {/* Top metrics grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Certificates panel */}
          <div className="border border-gray-200 p-5 bg-gray-50 flex items-start gap-4">
            <div className="p-3 bg-[#3373AB]/10 text-[#3373AB]">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Vetted Certification Tracks</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-1 font-light">
                Secure accredited hardware badges backed by structural validation exams. Trusted by global foundries and smart grid operators.
              </p>
            </div>
          </div>

          {/* Connected labs */}
          <div className="border border-gray-200 p-5 bg-gray-50 flex items-start gap-4">
            <div className="p-3 bg-[#3373AB]/10 text-[#3373AB]">
              <Video size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Digital Interactive Sandboxes</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-1 font-light">
                Write, compile, and execute code directly on actual remote hardware development racks situated in RTTI regional labs.
              </p>
            </div>
          </div>

          {/* Enterprise custom training */}
          <div className="border border-gray-200 p-5 bg-gray-50 flex items-start gap-4">
            <div className="p-3 bg-[#3373AB]/10 text-[#3373AB]">
              <GraduationCap size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Institutional Licenses Available</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-1 font-light">
                Equip whole university departments or systems engineering design teams with dynamic progress lockers.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: SELECTABLE COURSE CATALOG (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border border-gray-200 p-4 bg-gray-50">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">Direct Curricula Filter</label>
              <input 
                type="text" 
                placeholder="Find Course... (e.g. vision, cybersecurity)"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
              />
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200">
              {filteredCourses.map((course) => {
                const isActive = selectedCourse.id === course.id;
                return (
                  <div 
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    className={`p-4 text-left cursor-pointer transition-all ${isActive ? 'bg-[#3373AB] text-white' : 'hover:bg-gray-50 bg-white'}`}
                  >
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 font-bold tracking-widest ${isActive ? 'bg-white text-[#3373AB]' : 'bg-[#111111] text-white'}`}>
                      {course.level}
                    </span>
                    <h3 className={`font-bold font-sans text-xs mt-2 leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {course.title}
                    </h3>
                    <div className="flex gap-4 text-[10px] font-mono mt-3 text-gray-400">
                      <span className={`flex items-center gap-1 ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
                        <Clock size={10} />
                        {course.duration}
                      </span>
                      <span className={`flex items-center gap-1 ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
                        <User size={10} />
                        {course.studentsCount} Students
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trending Skills Sidebar block */}
            <div className="border border-gray-200 p-5 bg-gray-50">
              <h4 className="text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider mb-3">Trending Engineering Nodes</h4>
              <div className="flex flex-wrap gap-1.5">
                {trendingSkills.map((v) => (
                  <span key={v} className="bg-white border border-gray-200 text-gray-700 text-[10px] px-2 py-1 font-mono">{v}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT AREA: COHESIVE INTERACTIVE COURSE DEMONSTRATOR AND SYLLABUS VIEWER (8 Cols) */}
          <div className="lg:col-span-8 border border-gray-200 bg-white">
            
            {/* Header profile */}
            <div className="bg-[#111111] text-white p-6 border-b border-gray-800">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[#3373AB] font-mono text-xs font-bold uppercase tracking-widest">ACTIVE CURRICULA SPOTLIGHT</span>
                  <h3 className="font-sans font-bold text-lg text-white mt-1 uppercase tracking-tight leading-none">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400 mt-2">DEAN ASSOCIABLE: {selectedCourse.instructor} • PRICE ACCREDITATION: RWF {selectedCourse.price}</p>
                </div>
                {selectedCourse.certified && (
                  <span className="bg-amber-500 text-[#111111] font-mono font-bold text-[9px] px-2 py-1 tracking-widest flex items-center gap-1 uppercase">
                    <Shield size={10} />
                    Certified
                  </span>
                )}
              </div>

              {/* Tab options selectors */}
              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setActiveTab('syllabus')}
                  className={`text-xs font-semibold px-4 py-2 rounded-none transition-colors outline-none flex items-center gap-1.5 ${activeTab === 'syllabus' ? 'bg-[#3373AB] text-white' : 'bg-neutral-800 text-gray-300 hover:text-white'}`}
                >
                  <List size={12} />
                  Syllabus Tracks
                </button>
                <button 
                  onClick={() => setActiveTab('video')}
                  className={`text-xs font-semibold px-4 py-2 rounded-none transition-colors outline-none flex items-center gap-1.5 ${activeTab === 'video' ? 'bg-[#3373AB] text-white' : 'bg-neutral-800 text-gray-300 hover:text-white'}`}
                >
                  <Video size={12} />
                  Demonstration Feed
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className={`text-xs font-semibold px-4 py-2 rounded-none transition-colors outline-none flex items-center gap-1.5 ${activeTab === 'quiz' ? 'bg-[#3373AB] text-white' : 'bg-neutral-800 text-gray-300 hover:text-white'}`}
                >
                  <HelpCircle size={12} />
                  Certification Simulator
                </button>
              </div>
            </div>

            {/* TAB BODY: SYLLABUS LISTS */}
            {activeTab === 'syllabus' && (
              <div className="p-6 text-left space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-2">Detailed Curricula Milestones</h4>
                <div className="space-y-3">
                  {selectedCourse.syllabus.map((milestone, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 p-3.5 flex items-start gap-3 justify-between">
                      <div className="flex gap-3">
                        <span className="font-mono text-xs font-bold text-[#3373AB] mt-0.5">0{idx + 1}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{milestone}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Laboratory Task Grid • Interactive Debug Required</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-neutral-200 font-mono font-semibold text-gray-700 px-1.5 uppercase">8 hours</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB BODY: SIMULATED VIDEO PLAYER */}
            {activeTab === 'video' && (
              <div className="p-6">
                <div className="h-[280px] bg-neutral-900 border border-neutral-800 relative flex items-center justify-center">
                  {videoPlaying ? (
                    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-[#111111] text-[#3373AB]">
                      {/* Playback HUD info */}
                      <div className="flex justify-between text-xs font-mono">
                        <span className="animate-pulse flex items-center gap-1.5 text-[#3373AB]">
                          <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>
                          RTTI_LAB_STREAM: COMPACTION_VERIFIED
                        </span>
                        <span>02:14 / 14:10</span>
                      </div>
                      
                      {/* Animated spectrum simulation representing speech */}
                      <div className="flex justify-center items-center gap-1 h-20 w-44 mx-auto">
                        <div className="w-1 bg-[#3373AB] h-8 animate-pulse"></div>
                        <div className="w-1 bg-[#3373AB] h-14 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 bg-[#3373AB] h-6 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 bg-[#3373AB] h-12 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-1 bg-[#3373AB] h-9 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>

                      {/* Instructor explanation logs */}
                      <p className="text-center font-mono text-[10px] text-gray-400 capitalize bg-neutral-950 p-2 border border-neutral-800">
                        Instructor Sterling: &quot;Ensure the priority inheritance flag is initialized before mounting the stack queue...&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-neutral-950">
                      <GraduationCap className="text-[#3373AB] mb-4" size={42} />
                      <h4 className="font-sans font-bold text-xs text-white max-w-sm text-center uppercase tracking-wider">
                        DEMO STREAM: {selectedCourse.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-1 text-center">Contains 14:10 minutes of technical signal telemetry walkthroughs.</p>
                      <button 
                        onClick={handleStartVideo}
                        className="mt-5 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase py-2.5 px-5 tracking-widest flex items-center gap-2 rounded-none transition-colors outline-none"
                      >
                        <Play size={12} className="fill-white" />
                        <span>Initialize Demonstration</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB BODY: DETAILED QUIZ CERTIFICATION WORKBOOK */}
            {activeTab === 'quiz' && (
              <div className="p-6 text-left">
                {!activeCourseQuiz ? (
                  <div className="py-8 text-center text-gray-500 p-4 font-sans text-xs">
                    No scorecard module is pre-calibrated for on-demand validation of this course yet. Please pick &quot;Advanced Embedded Systems&quot; or &quot;Applied AI Embedded Vision&quot; to test.
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 font-sans">MOCK CERTIFICATION ACCREDITATION ENGINE</h4>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">Test engineering retention parameters immediately</p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 uppercase">{activeCourseQuiz.length} Questions Calibrated</span>
                    </div>

                    <div className="space-y-6">
                      {activeCourseQuiz.map((q, qIdx) => {
                        const hasSelected = quizAnswers[q.id] !== undefined;
                        return (
                          <div key={q.id} className="border border-gray-200 p-4 bg-gray-50">
                            <span className="font-mono text-[10px] text-gray-400 block uppercase font-bold mb-1">Question 0{qIdx + 1}</span>
                            <p className="text-xs font-bold text-gray-800 leading-snug">{q.questionText}</p>
                            
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = quizAnswers[q.id] === oIdx;
                                const isCorrect = q.correctIdx === oIdx;
                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleSelectAnswer(q.id, oIdx)}
                                    className={`w-full text-left p-2.5 text-xs text-sans font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-gray-100 bg-white border border-gray-200 text-gray-700'}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && <CheckCircle size={14} className="text-emerald-500" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button 
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length !== activeCourseQuiz.length}
                        className="mt-6 w-full bg-[#111111] hover:bg-neutral-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none"
                      >
                        Submit Scorecard for RTTI assessment
                      </button>
                    ) : (
                      <div className="mt-6 border-2 border-dashed border-[#3373AB] p-4 bg-gray-50 text-center animate-fade-in">
                        <GraduationCap className="text-[#3373AB] mx-auto mb-2" size={24} />
                        <h4 className="font-bold text-xs text-gray-900 uppercase">RTTI DIAGNOSTIC RESULTS PROTOCOL</h4>
                        <p className="text-base font-bold font-mono text-[#3373AB] mt-1">Passing: {scoreNum} / {activeCourseQuiz.length} correct ({Math.round((scoreNum / activeCourseQuiz.length) * 100)}%)</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed max-w-md mx-auto mt-2 font-mono font-light">
                          {scoreNum === activeCourseQuiz.length 
                            ? 'ESTABLISHED: Outstanding score. This passing score represents professional baseline retention parameters for this certificate tract.' 
                            : 'RESTORE: Passing mark is 100% threshold. Refine syllabus segments and repeat simulation tests.'}
                        </p>
                        <button 
                          onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                          className="mt-4 text-[10px] hover:underline font-mono text-[#3373AB] font-bold"
                        >
                          [RELOAD SIMULATION EXAMINATION]
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Career learning paths section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400">STRUCTURED PIPELINES</p>
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Accredited Learning Paths Matrix</h4>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 border-b border-gray-100 pb-2 mb-3">
                    <span>PATH 0{idx + 1}</span>
                    <span className="text-[#3373AB] font-bold">{path.coursesCount} Courses</span>
                  </div>
                  <h5 className="font-bold text-xs text-gray-900 uppercase tracking-wide font-sans">{path.name}</h5>
                  <p className="text-[11px] text-gray-500 mt-2 font-light leading-relaxed">{path.desc}</p>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="font-mono text-[10px] text-[#3373AB]">EST: {path.estimate}</span>
                  <button onClick={() => { setLocalSearch(path.name.slice(0, 10)); }} className="text-[11px] font-bold hover:underline font-mono text-gray-800 flex items-center gap-1 group">
                    <span>Initialize Path</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
