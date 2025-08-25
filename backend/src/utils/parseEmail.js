const parseEmail = (email) => {
  const parts = email.split('@')[0].split('.');
  const username = parts[0];

  // Logic for the new HOD and Staff email formats
  if (username.startsWith('hod')) {
    const department = parts[1].toUpperCase();
    return { batch: null, department, role: 'HOD' };
  }
  if (username.startsWith('staff')) {
    const department = parts[1].toUpperCase();
    return { batch: null, department, role: 'Advisor' }; // Assuming 'staff' corresponds to 'Advisor'
  }
  if (username === 'admin') {
    return { batch: null, department: 'ADM', role: 'Admin' };
  }

  // Original logic for student and other email formats
  if (parts.length >= 2) {
    const yearDeptCode = parts[1];
    const year = yearDeptCode.substring(0, 2);
    const department = yearDeptCode.substring(2).toUpperCase();
    const batch = `20${year}`;
    
    return { batch, department, role: 'Student' };
  }
  
  return { batch: null, department: null, role: null };
};

export { parseEmail };
