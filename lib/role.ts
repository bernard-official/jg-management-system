export const roles = {
    admin: {
      id: 1,
      name: 'Admin',
      permissions: ['create', 'read', 'update', 'delete'],
    },
    manager: {
      id: 2,
      name: 'Manager',
      permissions: ['read', 'update'],
    },
    employee: {
      id: 3,
      name: 'Employee',
      permissions: ['read'],
    },
  };