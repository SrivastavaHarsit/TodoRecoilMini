// src/utils/recoilInvalidate.js
import { useRecoilCallback } from 'recoil';
import { todoListQueryFamily } from '../state/todoSelectors';

/**
 * Small invalidation helper.
 * Resets the default list fetch. Add more resets if you keep multiple param sets.
 */
export function useInvalidateTodos() {
  return useRecoilCallback(({ reset }) => async () => {
    reset(todoListQueryFamily({}));
  }, []);
}
