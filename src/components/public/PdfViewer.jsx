import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';

export function PdfViewer({ src, title }) {
  return (
    <div className="rounded-2xl border border-[#252525] bg-[#121212] overflow-hidden">
      {/* Top action bar */}
      <div className="flex items-center justify-between p-4 bg-[#171717] border-b border-[#252525]">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#FF751F]" />
          <span className="text-xs font-semibold text-neutral-200 truncate max-w-xs sm:max-w-md">
            {title || 'PDF Document Preview'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#222222] text-neutral-300 hover:text-white hover:bg-[#2c2c2c] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Tab</span>
          </a>
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#FF751F] text-white hover:bg-[#FF8A3D] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded Iframe Preview */}
      <div className="w-full h-[520px] bg-[#1b1b1b] relative">
        <iframe
          src={`${src}#toolbar=0`}
          title={title}
          className="w-full h-full border-0"
        />
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-neutral-400 border border-white/10 pointer-events-none">
          PDF Document Viewer
        </div>
      </div>
    </div>
  );
}

