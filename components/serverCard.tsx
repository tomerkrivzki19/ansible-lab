import React from "react";

const STATUS = {
  ready: { icon: "🟠", label: "Ready" },
  pinging: { icon: "🔄", label: "Pinging..." },
  online: { icon: "🟢", label: "Online" },
};

export default function ServerCard({ name, os, status }) {
  const state = STATUS[status];
  const isPinging = status === "pinging";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 font-semibold text-slate-800 text-lg">
          <span className="text-xl">🖥️</span> {name}
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          {os}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 pt-3 border-t border-slate-100">
        <span className={`${isPinging ? "animate-spin inline-block" : ""}`}>
          {state.icon}
        </span>
        {state.label}
      </div>
    </div>
  );
}
