import { useSelector } from 'react-redux';
import { roleByIdSelector } from './selectors';

export const useRoleById = (roleId: number) =>
  useSelector((state) => roleByIdSelector(state, roleId));
