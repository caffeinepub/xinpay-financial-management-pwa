// Stub useActor hook — backend interface is empty, actor not used for data
// All data operations use localStorage via useLocalAuth and useQueries local logic

export function useActor() {
  return {
    actor: null as null,
    isFetching: false,
  };
}
