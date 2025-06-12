export const allAuthorities = [
  {
    id: 'user',
    title: '用户管理',
    children: [
      { id: 'authorization:users:page', title: '查看用户' },
    ]
  },
  {
    id: 'role',
    title: '权限群组管理',
    children: [
      { id: 'authorization:groups:page', title: '查看权限群组' },
    ]
  },
  {
    id: 'permission',
    title: '权限管理',
    children: [
      { id: 'permission:read', title: '查看权限' },
      { id: 'permission:create', title: '创建权限' },
      { id: 'permission:update', title: '更新权限' },
      { id: 'permission:delete', title: '删除权限' }
    ]
  }
];
