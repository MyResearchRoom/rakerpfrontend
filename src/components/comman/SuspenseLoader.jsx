import React from 'react';
import { BounceLoader } from 'react-spinners';
const SuspenseLoader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-[var(--color-bg)] bg-opacity-70 z-50">
      <BounceLoader color="#1c398e" size={60} />
    </div>
  );
};

export default SuspenseLoader;
