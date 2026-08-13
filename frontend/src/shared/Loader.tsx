import { useAppStore } from "@stores/zustandStore";
import React from "react";

const Loader: React.FC = () => {
  const { isLoading } = useAppStore((state) => state);

  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-[1300] flex items-center justify-center bg-black/50'>
      <span className='animate-pulse text-2xl font-bold text-primary'>!!!</span>
    </div>
  );
};

export default Loader;
