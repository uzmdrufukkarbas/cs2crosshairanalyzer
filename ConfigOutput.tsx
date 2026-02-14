import React, { useState } from 'react';
import { CrosshairConfig } from '../types';

interface ConfigOutputProps {
  config: CrosshairConfig;
}

export const ConfigOutput: React.FC<ConfigOutputProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const generateCommandString = (cfg: CrosshairConfig) => {
    return [
      `cl_crosshairsize ${cfg.cl_crosshairsize}`,
      `cl_crosshairthickness ${cfg.cl_crosshairthickness}`,
      `cl_crosshairgap ${cfg.cl_crosshairgap}`,
      `cl_crosshair_drawoutline ${cfg.cl_crosshair_drawoutline ? 1 : 0}`,
      `cl_crosshair_outlinethickness ${cfg.cl_crosshair_outlinethickness}`,
      `cl_crosshairdot ${cfg.cl_crosshairdot ? 1 : 0}`,
      `cl_crosshaircolor 5`,
      `cl_crosshaircolor_r ${cfg.cl_crosshaircolor_r}`,
      `cl_crosshaircolor_g ${cfg.cl_crosshaircolor_g}`,
      `cl_crosshaircolor_b ${cfg.cl_crosshaircolor_b}`,
      `cl_crosshairalpha ${cfg.cl_crosshairalpha}`,
      `cl_crosshairstyle ${cfg.cl_crosshairstyle}`,
      `cl_crosshair_t ${cfg.cl_crosshair_t ? 1 : 0}`,
      `cl_crosshair_sniper_width 1`,
    ].join('; ');
  };

  const commandString = generateCommandString(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(commandString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-lg mt-6 transition-colors duration-300">
      <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Console Code</h3>
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
            ${copied 
              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/50' 
              : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/50 hover:bg-orange-100 dark:hover:bg-orange-500/20'}
          `}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              COPIED
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              COPY COMMAND
            </>
          )}
        </button>
      </div>
      <div className="p-5 relative group bg-white dark:bg-black">
        <pre className="font-mono text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all leading-relaxed transition-colors duration-300">
          {commandString}
        </pre>
        {/* Gradient fade for long content visual cue if needed, or just style decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 dark:to-zinc-900/50 pointer-events-none" />
      </div>
    </div>
  );
};