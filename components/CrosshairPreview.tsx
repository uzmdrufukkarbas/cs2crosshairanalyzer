import React from 'react';
import { CrosshairConfig } from '../types';

interface CrosshairPreviewProps {
  config: CrosshairConfig;
}

export const CrosshairPreview: React.FC<CrosshairPreviewProps> = ({ config }) => {
  const SCALE = 4;
  
  const size = config.cl_crosshairsize * SCALE;
  const gap = config.cl_crosshairgap * SCALE;
  const thickness = config.cl_crosshairthickness * SCALE;
  const outline = config.cl_crosshair_drawoutline;
  const outlineThickness = config.cl_crosshair_outlinethickness * SCALE; 
  const dot = config.cl_crosshairdot;
  const isTStyle = config.cl_crosshair_t;
  
  const color = `rgba(${config.cl_crosshaircolor_r}, ${config.cl_crosshaircolor_g}, ${config.cl_crosshaircolor_b}, ${config.cl_crosshairalpha / 255})`;
  const outlineColor = `rgba(0, 0, 0, ${config.cl_crosshairalpha / 255})`;

  const renderLine = (x: number, y: number, w: number, h: number) => {
    return (
      <g>
        {outline && (
          <rect
            x={x - outlineThickness}
            y={y - outlineThickness}
            width={w + (outlineThickness * 2)}
            height={h + (outlineThickness * 2)}
            fill={outlineColor}
          />
        )}
        <rect x={x} y={y} width={w} height={h} fill={color} />
      </g>
    );
  };

  const cx = 100;
  const cy = 100;
  
  // Use a safer gap for rendering to avoid overlap if gap is negative in a weird way
  const safeGap = Math.max(-10, gap);

  // Position calculations
  const topY = cy - safeGap - size;
  const topX = cx - (thickness / 2);
  const botY = cy + safeGap;
  const botX = cx - (thickness / 2);
  const leftX = cx - safeGap - size;
  const leftY = cy - (thickness / 2);
  const rightX = cx + safeGap;
  const rightY = cy - (thickness / 2);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 bg-[url('https://picsum.photos/800/600?grayscale&blur=2')] bg-cover bg-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner transition-colors duration-300">
        {/* Overlay to darken/lighten background image for better crosshair visibility */}
        <div className="w-full h-full bg-white/30 dark:bg-slate-900/60 flex items-center justify-center backdrop-blur-[1px] transition-colors duration-300">
            <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible filter drop-shadow-sm">
            {!isTStyle && renderLine(topX, topY, thickness, size)}
            {renderLine(rightX, rightY, size, thickness)}
            {renderLine(botX, botY, thickness, size)}
            {renderLine(leftX, leftY, size, thickness)}
            
            {dot && (
                <g>
                {outline && (
                    <rect
                    x={cx - (thickness / 2) - outlineThickness}
                    y={cy - (thickness / 2) - outlineThickness}
                    width={thickness + (outlineThickness * 2)}
                    height={thickness + (outlineThickness * 2)}
                    fill={outlineColor}
                    />
                )}
                <rect
                    x={cx - (thickness / 2)}
                    y={cy - (thickness / 2)}
                    width={thickness}
                    height={thickness}
                    fill={color}
                />
                </g>
            )}
            </svg>
        </div>
    </div>
  );
};