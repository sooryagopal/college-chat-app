export const getVisibleGroups = (currentUser, allGroups) => {
  if (!currentUser || !allGroups) return [];
  const { role, department, batch } = currentUser;

  switch (role) {
    case 'Admin':
      // The Admin can see and manage ALL groups.
      return allGroups.sort((a, b) => a.name.localeCompare(b.name));
    case 'HOD':
      // HODs see global and their own department's groups.
      return allGroups
        .filter(g => g.type === 'Global' || g.department === department)
        .sort((a, b) => a.name.localeCompare(b.name));
    case 'Advisor':
      // Advisors see global and their specific batch group.
      return allGroups
        .filter(g => g.type === 'Global' || (g.type === 'Batch' && g.department === department && g.batch === batch))
        .sort((a, b) => a.name.localeCompare(b.name));
    case 'Student':
      // Students can only see global and their specific batch group.
      return allGroups
        .filter(g => g.type === 'Global' || (g.type === 'Batch' && g.department === department && g.batch === batch))
        .sort((a, b) => a.name.localeCompare(b.name));
    default:
      return [];
  }
};
