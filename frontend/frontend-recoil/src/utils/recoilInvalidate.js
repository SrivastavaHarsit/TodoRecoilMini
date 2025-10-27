import { useRecoilCallback } from 'recoil';
import { todosCacheAtom } from '../state/todoAtoms';
import { todoListQueryFamily, filteredTodoIdsSelector } from '../state/todoSelectors';

export function useInvalidateTodos() {
  return useRecoilCallback(({ reset, refresh }) => async () => {
    try {
      // Clear our cache so per-id selectors will fetch fresh data
      reset(todosCacheAtom);

      // Refresh the derived list of IDs and the list query family instance
      // Use the same params the UI requests (page 1, pageSize 200, empty search / default filter)
      refresh(filteredTodoIdsSelector);
      refresh(todoListQueryFamily({ search: '', filter: 'Show All', page: 1, pageSize: 200 }));

      return true;
    } catch (err) {
      console.error('Failed to invalidate todos:', err);
      throw err;
    }
  }, []);
}