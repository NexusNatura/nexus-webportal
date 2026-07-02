import React from 'react';
import { cn } from '../lib/utils'; // NEXUS standard

/**
 * renderar en snygg kort vy
 */
export const test1 = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className={cn("p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-xl", className)}>
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-nexus-gold">test1</h3>
                {children}
            </div>
        </div>
    );
};
