import React, { useState, useRef, useEffect } from 'react';
import { Video, Users, VideoOff, Mic, MicOff, Maximize2, Layers, Settings, Compass, MessageSquare, Send, Save, BookOpen, Clock, Activity, Cpu, Play, CheckCircle2 } from 'lucide-react';

interface LiveClassroomProps {
  theme?: 'light' | 'dark';
}

export default function LiveClassroom({ theme = 'light' }: LiveClassroomProps) {
  const isDark = theme === 'dark';
  const [activeBreakout, setActiveBreakout] = useState<string>('Main Assembly');
  const [recording, setRecording] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [whiteboardText, setWhiteboardText] = useState<string>('');
  
  // Real drawing canvas simulation variables
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<string>('#3373AB');

  // Chat message feed
  const [messages, setMessages] = useState([
    { user: 'Sarah Jenkins', role: 'Threat Coordinator', text: 'Has anyone validated the Modbus payload frame offset?', time: '16:40' },
    { user: 'Marcus Vance', role: 'RTTI Instructor', text: 'Yes, it needs a continuous hex preamble check.', time: '16:41' },
    { user: 'Clara Dupont', role: 'Student Node', text: 'I am getting some local parity noise on the gateway hub.', time: '16:42' }
  ]);

  // Live AI Notes logs
  const aiNotes = [
    "Core Concept: Dynamic priority promotion overrides low task scheduler starvation risk.",
    "Hardware Offset: VCC standard acceptable margin is 2.7V to 5.5V maximum limit.",
    "Telemetry Task: Log telemetry packets strictly over TCP to bypass UDP payload dropping on smart grids."
  ];

  // Cycling Live Caption ticker
  const [captionIndex, setCaptionIndex] = useState(0);
  const captionLyrics = [
    "...we are examining how the bus matrix arbiter controls DMA bursts...",
    "...each clock pulse validates the internal registers configuration before execution...",
    "...priority inheritance blocks lower tasks from holding the mutex indefinitely...",
    "...let&apos;s map the SCADA Threat payload using standard network tools..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex(prev => (prev + 1) % captionLyrics.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      { user: 'You (Developer Portal)', role: 'Verified Guest', text: chatInput, time: '16:42' }
    ]);
    setChatInput('');
  };

  // Drawing canvas logic - very satisfying for professional design
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas background to light gray
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initial blueprint guidelines representation
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    // Grid lines
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.setLineDash([]); // Reset line dash
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'square';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#111111] text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">VIRTUAL BROADCAST SIMULATOR</p>
            <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1">HD LIVE CLASSROOM RTTI SANDBOX</h2>
          </div>
          
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[11px] bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
              {recording ? 'RECORDING SESSION' : 'PLAYBACK SESSION'}
            </span>
            <span className="font-mono text-[11px] bg-neutral-800 border border-neutral-700 px-2.5 py-1">
              LATENCY: 42ms
            </span>
          </div>
        </div>

        {/* Outer zoom grid wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border border-neutral-800 bg-[#161616]">
          
          {/* PRIMARY WORKSPACE: VIDEO STREAM + ACTIVE WHITEBOARD (9 Cols) */}
          <div className="lg:col-span-9 flex flex-col divide-y divide-neutral-800">
            
            {/* Split screen: Video Feeds at top, whiteboard or logs below */}
            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[300px]">
              
              {/* Left feed: Instructor main stream */}
              <div className="md:col-span-8 bg-neutral-950 min-h-[220px] relative overflow-hidden flex flex-col justify-between p-4">
                <div className="flex justify-between items-center text-[10px] font-mono z-10">
                  <span className="bg-[#3373AB] text-white px-1.5 py-0.5 uppercase tracking-wide">Instructor Feed (Primary)</span>
                  <span className="text-gray-400">1080p60 • HD STREAMING</span>
                </div>

                {/* Animated visual telemetry wave simulating the stream */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25">
                  <Cpu className="text-[#3373AB] animate-pulse" size={124} />
                </div>

                {/* Stream Subtitles cycling */}
                <div className="w-full text-center bg-neutral-950/70 py-1.5 px-3 border border-neutral-800 z-10 self-end">
                  <span className="font-mono text-xs text-amber-400 leading-none" dangerouslySetInnerHTML={{ __html: captionLyrics[captionIndex] }}></span>
                </div>
              </div>

              {/* Right secondary feed: Team attendees (Grid of 2 smaller boxes) */}
              <div className="md:col-span-4 grid grid-rows-2 divide-y divide-neutral-800">
                <div className="bg-neutral-900 p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono z-10">
                    <span className="text-gray-300">Clara Dupont (Guest)</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <div className="flex justify-center items-center opacity-20">
                    <Users size={42} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 z-10">Muted by Administrator</span>
                </div>

                <div className="bg-neutral-900 p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono z-10">
                    <span className="text-gray-300">Sarah Jenkins (Threat Lead)</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <div className="flex justify-center items-center opacity-20">
                    <Activity size={42} className="text-[#3373AB]" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 z-10">Active Telemetry Connected</span>
                </div>
              </div>

            </div>

            {/* WHITEBOARD CANVAS - Real interactive drawing module */}
            <div className="p-5 bg-[#1C1C1C]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-3 mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-[#3373AB]" />
                  <span className="font-sans font-bold text-xs uppercase tracking-wide text-white">Interactive Assembly Whiteboard</span>
                </div>

                {/* Drawing parameters */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setBrushColor('#3373AB')} className={`w-3.5 h-3.5 bg-[#3373AB] border ${brushColor === '#3373AB' ? 'border-white scale-125' : 'border-transparent'}`} title="Blue brush"></button>
                    <button onClick={() => setBrushColor('#EF4444')} className={`w-3.5 h-3.5 bg-[#EF4444] border ${brushColor === '#EF4444' ? 'border-white scale-125' : 'border-transparent'}`} title="Red brush"></button>
                    <button onClick={() => setBrushColor('#10B981')} className={`w-3.5 h-3.5 bg-[#10B981] border ${brushColor === '#10B981' ? 'border-white scale-125' : 'border-transparent'}`} title="Green brush"></button>
                    <button onClick={() => setBrushColor('#111111')} className={`w-3.5 h-3.5 bg-[#111111] border ${brushColor === '#111111' ? 'border-white scale-125' : 'border-transparent'}`} title="Black brush"></button>
                  </div>
                  <button 
                    onClick={clearCanvas} 
                    className="text-[9px] font-mono bg-neutral-800 border border-neutral-700 font-bold px-2 py-1 text-gray-300 hover:text-white"
                  >
                    [ERASE MATRIX]
                  </button>
                </div>
              </div>

              {/* Real canvas container */}
              <div className="border border-neutral-800 bg-[#FAFAFA] relative overflow-hidden" style={{ cursor: 'crosshair' }}>
                <canvas 
                  ref={canvasRef} 
                  width={760} 
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full block"
                ></canvas>
                <div className="absolute top-1 left-2 pointer-events-none select-none text-[8px] font-mono text-gray-400">
                  DRAG CURSOR HERE TO DRAW SCHEMATICS METRICS
                </div>
              </div>
            </div>

            {/* VIDEO CONTROLS BAR */}
            <div className="p-3 bg-[#111111] flex items-center justify-between text-xs font-mono px-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCameraOn(!cameraOn)} 
                  className={`flex items-center gap-1 font-semibold ${cameraOn ? 'text-[#3373AB]' : 'text-red-500'}`}
                >
                  {cameraOn ? <Video size={14} /> : <VideoOff size={14} />}
                  <span>{cameraOn ? 'CAMERA ACTIVE' : 'CAMERA OFF'}</span>
                </button>
                
                <button 
                  onClick={() => setMicOn(!micOn)} 
                  className={`flex items-center gap-1 font-semibold ${micOn ? 'text-[#3373AB]' : 'text-red-500'}`}
                >
                  {micOn ? <Mic size={14} /> : <MicOff size={14} />}
                  <span>{micOn ? 'VOICE ON' : 'MUTED'}</span>
                </button>
              </div>

              {/* Dynamic room changer */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Current Room Hub:</span>
                <select 
                  value={activeBreakout} 
                  onChange={(e) => setActiveBreakout(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 text-[10px] text-gray-200 px-2.5 py-1 focus:outline-none"
                >
                  <option value="Main Assembly">Main Assembly (24 Nodes)</option>
                  <option value="Breakout Block A">Breakout Block A (4 Nodes)</option>
                  <option value="Breakout Block B">Breakout Block B (3 Nodes)</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: REAL TIME LOG CHAT FEED AND AI LOGS (3 Cols) */}
          <div className="lg:col-span-3 border-l border-neutral-800 flex flex-col justify-between min-h-[400px]">
            
            {/* Top AI live logger */}
            <div className="p-4 border-b border-neutral-800 bg-[#141414]">
              <span className="text-[10px] bg-[#3373AB] text-white px-1.5 py-0.5 uppercase tracking-widest font-bold block w-max font-mono mb-2">RTTI AI Copilot</span>
              <h4 className="font-bold font-sans text-xs uppercase tracking-wide">Live Diagnostics Summary</h4>
              
              <ul className="space-y-2 mt-3 text-[10px] font-sans font-light leading-relaxed text-gray-300">
                {aiNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-2 items-start border-l border-[#3373AB] pl-2">
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat message register */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[220px]">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-left">
                  <div className="flex items-end justify-between">
                    <span className="text-[11px] font-bold text-white font-sans">{msg.user}</span>
                    <span className="text-[9px] font-mono text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-[10px] font-mono text-[#3373AB] leading-none uppercase font-semibold mt-0.5">{msg.role}</p>
                  <p className="text-xs text-gray-300 mt-1 pl-2 border-l border-gray-700 leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Form messaging submission */}
            <form onSubmit={handleSendMessage} className="p-3 bg-neutral-950 border-t border-neutral-850 flex gap-2">
              <input 
                type="text" 
                placeholder="Log chat text..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 text-white w-full outline-none focus:border-[#3373AB] font-sans rounded-none"
              />
              <button 
                type="submit" 
                className="bg-[#3373AB] text-white p-2 rounded-none transition-colors hover:bg-[#255C8E] outline-none"
              >
                <Send size={12} />
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
