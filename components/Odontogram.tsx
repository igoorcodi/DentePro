
import React, { useState } from 'react';

const Odontogram: React.FC = () => {
  const topTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const bottomTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const [toothStatus, setToothStatus] = useState<Record<number, string>>({});

  const toggleTooth = (id: number) => {
    const statuses = ['healthy', 'decay', 'restoration', 'missing', 'implant'];
    const currentStatus = toothStatus[id] || 'healthy';
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    setToothStatus(prev => ({ ...prev, [id]: statuses[nextIdx] }));
  };

  const getToothColor = (id: number) => {
    switch (toothStatus[id]) {
      case 'decay': return 'fill-red-500 stroke-red-600';
      case 'restoration': return 'fill-blue-500 stroke-blue-600';
      case 'missing': return 'fill-slate-200 stroke-slate-300 opacity-20';
      case 'implant': return 'fill-emerald-500 stroke-emerald-600';
      default: return 'fill-white stroke-slate-400 hover:fill-slate-50';
    }
  };

  const ToothSVG = ({ id }: { id: number }) => (
    <div 
      className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
      onClick={() => toggleTooth(id)}
    >
      <span className="text-[10px] font-bold text-slate-400 mb-1">{id}</span>
      <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-sm">
        <path 
          d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8C20 14 18 20 16 26C15 29 14 30 12 30C10 30 9 29 8 26C6 20 4 14 4 8Z" 
          className={`transition-colors duration-200 ${getToothColor(id)}`}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 overflow-x-auto">
      <div className="min-w-[800px] space-y-8">
        {/* Top Row */}
        <div className="flex justify-between items-end gap-2 px-4">
          <div className="flex gap-2">
            {topTeeth.slice(0, 8).map(id => <ToothSVG key={id} id={id} />)}
          </div>
          <div className="w-[2px] h-12 bg-slate-100 mx-4"></div>
          <div className="flex gap-2">
            {topTeeth.slice(8).map(id => <ToothSVG key={id} id={id} />)}
          </div>
        </div>

        {/* Legend & Mid line */}
        <div className="flex items-center justify-between py-4 border-y border-slate-50">
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div> Saudável</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Cárie</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Restauração</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Implante</div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Odontograma Digital V2.0</p>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-start gap-2 px-4">
          <div className="flex gap-2">
            {bottomTeeth.slice(0, 8).map(id => <ToothSVG key={id} id={id} />)}
          </div>
          <div className="w-[2px] h-12 bg-slate-100 mx-4"></div>
          <div className="flex gap-2">
            {bottomTeeth.slice(8).map(id => <ToothSVG key={id} id={id} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Odontogram;
