import { useCallback, useState } from "preact/hooks";

export function useUpdater() {
    const [, updateState] = useState<object>();
    const forceUpdate = useCallback(() => updateState({}), []);
    return forceUpdate;
}
