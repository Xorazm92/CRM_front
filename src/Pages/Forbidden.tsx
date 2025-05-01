import React from "react";

const Forbidden: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
    <p className="text-lg">Sizda bu sahifaga kirish huquqi yo'q.</p>
  </div>
);

export default Forbidden;
