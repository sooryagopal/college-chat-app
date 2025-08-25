import React from 'react';

const RoleBadge = ({ role }) => {
  let color = '';
  switch (role) {
    case 'Admin':
      color = 'bg-red-500';
      break;
    case 'HOD':
      color = 'bg-yellow-500';
      break;
    case 'Advisor':
      color = 'bg-green-500';
      break;
    default:
      color = 'bg-blue-500';
  }
  return (
    <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}>
      {role}
    </span>
  );
};

export default RoleBadge;