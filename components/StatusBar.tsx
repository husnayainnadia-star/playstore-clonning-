'use client';
export default function StatusBar() {
  return (
    <div className="flex justify-between items-center px-6 pt-3 pb-1 flex-shrink-0">
      <span className="text-[13px] font-semibold text-[#202124]">9:41</span>
      <div className="flex gap-1 items-center">
        <span className="material-icons-round text-[16px] text-[#202124]">signal_cellular_4_bar</span>
        <span className="material-icons-round text-[16px] text-[#202124]">wifi</span>
        <span className="material-icons-round text-[16px] text-[#202124]">battery_full</span>
      </div>
    </div>
  );
}
