import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#252525] flex items-center justify-center mx-auto text-[#FF751F]">
          <Compass className="w-8 h-8" />
        </div>
        <div className="font-heading font-extrabold text-7xl text-white tracking-wider">
          4<span className="text-[#FF751F]">0</span>4
        </div>
        <h1 className="text-2xl font-heading font-bold text-white">
          Visual Coordinate Not Found
        </h1>
        <p className="text-sm text-neutral-400 font-sans leading-relaxed">
          The requested page or portfolio asset does not exist or has been relocated to another dimension.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button size="md" leftIcon={Home}>
              Return to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

