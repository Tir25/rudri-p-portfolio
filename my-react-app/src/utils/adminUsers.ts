export type AdminUser = {
  id: string;
  email: string;
  addedBy?: string;
  addedAt?: any;
  permissions?: { canEdit?: boolean; canDelete?: boolean };
  isActive?: boolean;
};

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  return [];
}

export async function addAdminUser(
  email: string,
  password: string,
  addedBy: string,
  permissions: { canEdit: boolean; canDelete: boolean }
): Promise<void> {
  return;
}

export async function deactivateAdminUser(
  adminId: string,
  performedBy: string
): Promise<void> {
  return;
}


