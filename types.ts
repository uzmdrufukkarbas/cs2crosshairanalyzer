export interface CrosshairConfig {
  cl_crosshairsize: number;
  cl_crosshairthickness: number;
  cl_crosshairgap: number;
  cl_crosshair_drawoutline: boolean;
  cl_crosshair_outlinethickness: number;
  cl_crosshairdot: boolean;
  cl_crosshaircolor_r: number;
  cl_crosshaircolor_g: number;
  cl_crosshaircolor_b: number;
  cl_crosshairalpha: number;
  cl_crosshairstyle: number;
  cl_crosshair_t: boolean; // T-style crosshair
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  config: CrosshairConfig | null;
  originalImage: string | null;
  errorMessage?: string;
}
