import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
    Zap, Aperture, BatteryMedium, Sun, Moon, Disc, 
    Upload, Cloud, Download, Flame 
} from 'lucide-react';

const App = () => {
  const [filterMode, setFilterMode] = useState('koda'); 
  const [isFlashing, setIsFlashing] = useState(false);
  const [printingState, setPrintingState] = useState('idle'); 
  const [printId, setPrintId] = useState(0);
  const [customImage, setCustomImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const printRef = useRef(null); 

  const defaultImage = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop";
  const displayImage = customImage || defaultImage;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
    }
  };

  const handleShutter = () => {
    if (printingState === 'printing') return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    setPrintingState('idle'); 
    
    setTimeout(() => {
        setPrintId(p => p + 1);
        setPrintingState('printing');
    }, 50);

    setTimeout(() => {
      setPrintingState('developed');
    }, 4500);
  };

  const handleDownload = async () => {
      if (!printRef.current) return;
      setIsSaving(true);
      try {
          const canvas = await html2canvas(printRef.current, {
              useCORS: true, 
              scale: 2, 
              backgroundColor: '#eee', 
          });

          const link = document.createElement('a');
          link.download = `retrocam-${filterMode}-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
      } catch (err) {
          console.error("Failed to save image:", err);
          alert("Could not save image. Browser security restricted the download.");
      }
      setIsSaving(false);
  };

  const getFilterClass = (mode) => {
    switch (mode) {
      case 'sepia': return 'sepia-[.3] contrast-125 brightness-90 hue-rotate-[-15deg] saturate-[.8]';
      case 'neon': return 'saturate-[1.8] contrast-110 hue-rotate-[10deg] brightness-110';
      case 'noir': return 'grayscale contrast-[1.4] brightness-90';
      case 'retro': return 'contrast-[0.9] brightness-110 sepia-[0.3] hue-rotate-[-30deg] saturate-[0.7]';
      case 'cyber': return 'contrast-[1.3] brightness-105 hue-rotate-[180deg] saturate-[1.2]';
      case 'koda': return 'contrast-[1.6] saturate-[1.6] brightness-100 sepia-[0.0] hue-rotate-[-09deg]'; 
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-mono overflow-hidden select-none">
      
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="relative w-full max-w-md bg-[#2a2a2a] rounded-[2.5rem] p-6 shadow-2xl border-b-8 border-r-8 border-[#1a1a1a] flex flex-col items-center gap-6 transform transition-transform duration-700">
        
        <div className="absolute inset-0 rounded-[2.5rem] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none"></div>
        
        <div className="w-full flex justify-between items-center px-4 relative z-10">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs tracking-widest uppercase font-bold text-gray-500">RetroCam 90</span>
          </div>
          <div className="flex gap-1">
             <div className="w-12 h-6 bg-[#111] rounded border border-gray-700 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine`}></div>
             </div>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden shadow-inner border-4 border-[#1a1a1a] group">
            <div className="absolute inset-[-10%] w-[120%] h-[120%]">
                <img 
                    src={displayImage} 
                    alt="Viewfinder" 
                    crossOrigin="anonymous" 
                    className={`w-full h-full object-cover transition-all duration-500 animate-handheld-shake ${getFilterClass(filterMode)}`}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-30 mix-blend-overlay"></div>
            </div>

            <div className={`absolute inset-0 bg-white transition-opacity duration-200 pointer-events-none z-50 ${isFlashing ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-70 pointer-events-none">
                <div className="flex justify-between items-start text-green-400 text-xs text-shadow-glow">
                    <span>ISO 400</span>
                    <BatteryMedium size={16} />
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-green-400/50 rounded-full"></div>
                </div>

                <div className="flex justify-between items-end text-green-400 text-xs font-bold text-shadow-glow">
                    <span className="uppercase">{filterMode} MODE</span>
                    <span>[ {printingState === 'printing' ? 'BUSY' : 'READY'} ]</span>
                </div>
            </div>
        </div>

        <div className="w-full bg-[#222] p-4 rounded-xl border-t border-white/10 shadow-lg relative z-10">
            <div className="flex justify-between items-center gap-2">
                
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 mask-image-fade scrollbar-hide">
                    <FilterButton active={filterMode === 'noir'} onClick={() => setFilterMode('noir')} color="gray" label="1950" icon={<Moon size={14} />} />
                    <FilterButton active={filterMode === 'koda'} onClick={() => setFilterMode('koda')} color="red" label="1960" icon={<Flame size={14} />} />
                     <FilterButton active={filterMode === 'retro'} onClick={() => setFilterMode('retro')} color="green" label="1970" icon={<Cloud size={14} />} />
                    <FilterButton active={filterMode === 'sepia'} onClick={() => setFilterMode('sepia')} color="amber" label="1980" icon={<Sun size={14} />} />
                    <FilterButton active={filterMode === 'neon'} onClick={() => setFilterMode('neon')} color="fuchsia" label="1990" icon={<Zap size={14} />} />
                    <FilterButton active={filterMode === 'cyber'} onClick={() => setFilterMode('cyber')} color="cyan" label="3999" icon={<Disc size={14} />} />
                    
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 border-[#333] bg-[#1a1a1a] text-gray-500 hover:text-white hover:bg-[#252525] hover:border-gray-600 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] font-bold text-[0.65rem] gap-1"
                            title="Load Film"
                        >
                            <Upload size={14} />
                            <span>LOAD</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                </div>

                <button 
                    onClick={handleShutter}
                    disabled={printingState === 'printing'}
                    className={`
                        flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 
                        shadow-[0_4px_0_rgb(153,27,27),0_8px_15px_rgba(0,0,0,0.4)] 
                        active:shadow-[0_0px_0_rgb(153,27,27),inset_0_4px_10px_rgba(0,0,0,0.3)] 
                        active:translate-y-1 transition-all flex items-center justify-center border-4 border-[#333]
                        ${printingState === 'printing' ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}
                    `}
                >
                    <Aperture className="text-red-900/40" size={32} />
                </button>
            </div>
        </div>

        <div className="w-64 h-3 bg-[#0a0a0a] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative z-20 overflow-visible flex justify-center">
            {printingState !== 'idle' && (
                <div 
                    key={printId}
                    className="absolute top-0 w-56 bg-[#eee] p-3 pt-4 pb-8 shadow-xl animate-print-slide origin-top z-10 flex flex-col items-center group/print"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div ref={printRef} className="w-full flex flex-col items-center bg-[#eee] p-1">
                        <div className="w-full aspect-square bg-[#111] overflow-hidden relative shadow-inner">
                            <img 
                                src={displayImage} 
                                crossOrigin="anonymous"
                                className={`w-full h-full object-cover ${getFilterClass(filterMode)}`}
                                alt="Printed memory" 
                            />
                            <div className="absolute inset-0 bg-[#0a0a0a] animate-develop mix-blend-multiply pointer-events-none"></div>
                        </div>
                        
                        <div className="mt-4 self-start w-full transform -rotate-1 pl-2">
                            <div className="font-handwriting text-gray-600 text-sm opacity-80 animate-fade-in-slow">
                                {filterMode === 'noir' ? 'Nov 23, 1950' :
                                filterMode === 'koda' ? 'May 16, 1964' :
                                filterMode === 'retro' ? 'Aug 14, 1972' :
                                filterMode === 'sepia' ? 'Dec 12, 1980' : 
                                filterMode === 'neon' ? 'July 04, 1990' : 
                                'Jan 01, 3999'}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownload}
                        disabled={isSaving}
                        className={`
                            absolute -bottom-12 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg 
                            transition-all duration-300 transform scale-0 
                            ${printingState === 'developed' ? 'scale-100' : ''}
                        `}
                        title="Save to Device"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Download size={18} />}
                    </button>
                </div>
            )}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-handwriting { font-family: 'Permanent Marker', cursive; }
        .text-shadow-glow { text-shadow: 0 0 5px rgba(74, 222, 128, 0.5); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes handheld-shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(2px, 2px) rotate(0.5deg); }
            50% { transform: translate(-1px, 1px) rotate(-0.5deg); }
            75% { transform: translate(-2px, -1px) rotate(0.2deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-handheld-shake { animation: handheld-shake 4s infinite ease-in-out; }
        @keyframes print-slide {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(115%); opacity: 1; }
        }
        .animate-print-slide { animation: print-slide 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes develop {
            0% { opacity: 1; background-color: #050505; }
            30% { opacity: 0.9; background-color: #1a1a1a; }
            100% { opacity: 0; background-color: transparent; }
        }
        .animate-develop { animation: develop 4s ease-in-out forwards; animation-delay: 1.2s; }
        .animate-fade-in-slow { animation: fadeIn 3s ease-out forwards; animation-delay: 2s; opacity: 0; }
        @keyframes fadeIn { to { opacity: 0.8; } }
        @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-shine { animation: shine 3s infinite linear; }
      `}</style>
    </div>
  );
};

const FilterButton = ({ active, onClick, color, label, icon }) => {
    const getColorStyles = () => {
        if (!active) return 'bg-[#333] text-gray-500 border-[#444] shadow-[0_2px_0_#111] translate-y-0 flex-shrink-0 hover:bg-[#3a3a3a]';
        switch(color) {
            case 'amber': return 'bg-amber-600 text-amber-100 border-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.5)] translate-y-[2px] flex-shrink-0';
            case 'fuchsia': return 'bg-fuchsia-600 text-fuchsia-100 border-fuchsia-400 shadow-[0_0_10px_rgba(192,38,211,0.5)] translate-y-[2px] flex-shrink-0';
            case 'green': return 'bg-emerald-600 text-emerald-100 border-emerald-400 shadow-[0_0_10px_rgba(5,150,105,0.5)] translate-y-[2px] flex-shrink-0';
            case 'cyan': return 'bg-cyan-600 text-cyan-100 border-cyan-400 shadow-[0_0_10px_rgba(8,145,178,0.5)] translate-y-[2px] flex-shrink-0';
            case 'red': return 'bg-red-600 text-red-100 border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)] translate-y-[2px] flex-shrink-0';
            case 'gray': 
            default: return 'bg-gray-600 text-gray-100 border-gray-400 shadow-[0_0_10px_rgba(75,85,99,0.5)] translate-y-[2px] flex-shrink-0';
        }
    }

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 
                transition-all duration-100 font-bold text-[0.65rem] gap-1
                ${getColorStyles()}
            `}
        >
            {icon}
            <span>{label}</span>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mt-1"></div>}
        </button>
    );
};

export default App;
