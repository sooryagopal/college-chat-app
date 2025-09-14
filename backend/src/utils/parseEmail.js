const parseEmail = (email) => {
  // Check for a valid email format before splitting
  if (!email || !email.includes('@')) {
    return { batch: null, department: null, role: null };
  }

  const [usernamePart, domain] = email.split('@');
  const parts = usernamePart.split('.');
  const username = parts[0];

  // Logic for Admin role
  if (username === 'admin') {
    return { batch: null, department: 'ADM', role: 'Admin' };
  }

  // Logic for HOD and Staff email formats
  // MENTOR ADVICE: We check if `parts.length > 1` to prevent the error
  if (username.startsWith('hod') && parts.length > 1) {
    const department = parts[1].toUpperCase();
    return { batch: null, department, role: 'HOD' };
  }
  if (username.startsWith('staff') && parts.length > 1) {
    const department = parts[1].toUpperCase();
    return { batch: null, department, role: 'Advisor' };
  }

  // Logic for Student emails
  if (parts.length >= 2) {
    const yearDeptCode = parts[1];
    // Ensure the string has at least 3 characters before slicing
    if (yearDeptCode.length >= 3) {
      const year = yearDeptCode.substring(0, 2);
      const department = yearDeptCode.substring(2).toUpperCase();
      const batch = `20${year}`;

      return { batch, department, role: 'Student' };
    }
  }

  // Default return for any unhandled format
  return { batch: null, department: null, role: null };
};

export { parseEmail };