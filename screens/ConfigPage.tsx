import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, UserEstado } from '../types';
import { usersApi } from '../utils/api';
import UserModal from '../components/UserModal';

interface ConfigPageProps {
  user: User;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ user: currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch users:', err.message);
      setError('Error al cargar usuarios: ' + err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search filter (name, email)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = u.name?.toLowerCase().includes(searchLower);
        const matchesEmail = u.email?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }

      // Role filter
      if (roleFilter && u.role !== roleFilter) return false;

      // Status filter
      if (statusFilter && u.estado !== statusFilter) return false;

      return true;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Handle create new user
  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await usersApi.create(userData);
      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear usuario');
    }
  };

  // Handle update user
  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!editingUser) return;
    try {
      await usersApi.update(editingUser.id, userData);
      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar usuario');
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await usersApi.delete(userToDelete.id);
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err: any) {
      setError('Error al eliminar usuario: ' + err.message);
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  // Open delete confirmation
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Check if current user can edit/delete
  const canEdit = currentUser.role?.toLowerCase() === 'admin';
  const canDelete = currentUser.role?.toLowerCase() === 'admin';

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#5e72e4] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#344767]">Configuración del Sistema</h1>
            <p className="text-sm text-gray-500">Gestión de usuarios y permisos</p>
          </div>
        </div>
        <div className="h-0.5 bg-gray-200 w-full mt-2"></div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-[#5e72e4] hover:bg-[#324cdd] text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Usuario
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5e72e4] focus:ring-1 focus:ring-[#5e72e4] w-full sm:w-64"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5e72e4] focus:ring-1 focus:ring-[#5e72e4]"
          >
            <option value="">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Técnico">Técnico</option>
            <option value="Auditor">Auditor</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5e72e4] focus:ring-1 focus:ring-[#5e72e4]"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fe] border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-bold text-[#344767] uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#344767] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#344767] uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#344767] uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#344767] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cargando usuarios...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f0f4ff] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#5e72e4] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#344767]">{u.name}</div>
                          {u.cargo && <div className="text-xs text-gray-500">{u.cargo}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'Técnico' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-gray-500 hover:text-[#5e72e4] hover:bg-[#f0f4ff] rounded transition-colors"
                            title="Editar usuario"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {canDelete && u.id !== currentUser.id && (
                          <button
                            onClick={() => openDeleteModal(u)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar usuario"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Total de usuarios: {filteredUsers.length}
      </div>

      {/* Create/Edit User Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#344767]">Confirmar eliminación</h3>
                  <p className="text-sm text-gray-500">¿Estás seguro de eliminar este usuario?</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-[#344767]">{userToDelete.name}</p>
                <p className="text-sm text-gray-500">{userToDelete.email}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPage;
