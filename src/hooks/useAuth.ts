/**
 * Hook de autenticação de um usuário Google.
 */
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
    // const value = useContext(AuthContext);
    // return value;
    return useContext(AuthContext);
}