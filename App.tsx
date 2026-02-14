import React, { useState, useEffect } from 'react';
import { Dropzone } from './components/Dropzone';
import { CrosshairPreview } from './components/CrosshairPreview';
import { ConfigOutput } from './components/ConfigOutput';
import { analyzeCrosshairImage } from './services/geminiService';
import { AnalysisState } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    config: null,
    originalImage: null,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark'); // Default to dark for gaming vibe
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleImageSelected = async (base64: string) => {
    setState(prev => ({ ...prev, status: 'analyzing', originalImage: base64, errorMessage: undefined }));
    
    try {
      const config = await analyzeCrosshairImage(base64);
      setState(prev => ({ ...prev, status: 'success', config }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        errorMessage: 'Failed to analyze crosshair. Please try another image or ensure the crosshair is clearly visible.' 
      }));
    }
  };

  const handleReset = () => {
    setState({ status: 'idle', config: null, originalImage: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 transition-colors duration-500 ease-in-out selection:bg-orange-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                CS2<span className="text-orange-500">Crosshair</span>Analyzer
              </span>
            </div>
            
            <div className="flex items-center gap-6">
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Powered by Gemini AI
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Original */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Scan your Crosshair
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Upload a screenshot of any CS2 crosshair. Our AI will analyze the pixels and generate the exact console commands for you to copy.
              </p>
              
              <AnimatePresence mode="wait">
                {state.status === 'idle' || state.status === 'error' ? (
                  <motion.div 
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Dropzone onImageSelected={handleImageSelected} disabled={state.status === 'analyzing'} />
                    {state.status === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm"
                      >
                        {state.errorMessage}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10"
                  >
                    <img 
                      src={state.originalImage!} 
                      alt="Original Crosshair" 
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={handleReset}
                        className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                      >
                        Upload New Image
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Instructions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-black rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none transition-colors duration-300"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span>
                Quick Guide
              </h3>
              <ol className="space-y-4">
                {[
                  "Copy the generated code from the right panel.",
                  "Open CS2 and press `~` to open the developer console.",
                  "Paste the code and hit Enter to apply settings instantly."
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-mono text-slate-400 dark:text-slate-600 select-none">0{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {/* Right Column: Result & Preview */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {state.status === 'analyzing' && (
                 <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center min-h-[500px] bg-slate-100 dark:bg-black rounded-3xl border border-slate-200 dark:border-zinc-800"
                 >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-slate-200 dark:border-zinc-800 border-t-orange-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="mt-8 text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                      Analyzing pixel patterns...
                    </p>
                 </motion.div>
              )}

              {state.status === 'success' && state.config && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="space-y-8"
                >
                  
                  {/* Visual Preview */}
                  <div>
                     <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 ml-1">Generated Preview</h2>
                     <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10">
                        <CrosshairPreview config={state.config} />
                     </div>
                     <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-right">
                       *Visual approximation based on extracted config
                     </p>
                  </div>

                  {/* Code Output */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 ml-1">Configuration Code</h2>
                    <ConfigOutput config={state.config} />
                  </motion.div>
                </motion.div>
              )}
              
              {state.status === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center min-h-[500px] text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-50/50 dark:bg-black"
                >
                  <div className="w-24 h-24 mb-6 opacity-20 bg-[url('https://picsum.photos/200/200')] bg-cover rounded-full grayscale mix-blend-luminosity"></div>
                  <p className="text-xl font-medium text-slate-500 dark:text-slate-500">Waiting for upload...</p>
                  <p className="text-sm mt-2">The analysis results will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;