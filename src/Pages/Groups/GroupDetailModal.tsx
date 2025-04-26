// Migration placeholder for GroupDetailModal.jsx to .tsx
// The actual code will be migrated from the .jsx file and refactored to TypeScript.

import React from "react";

interface GroupDetailModalProps {
  groupId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({ groupId, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320 }}>
        <h3>GroupDetailModal tayyorlanmoqda...</h3>
        <div>ID: {groupId}</div>
        <button onClick={onClose}>Yopish</button>
      </div>
    </div>
  );
};

export default GroupDetailModal;
