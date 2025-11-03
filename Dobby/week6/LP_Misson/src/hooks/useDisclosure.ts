import { useCallback, useState } from "react";

export const useDisclosure = (initial = false) => {
    const [isOpen, setIsOpen] = useState<boolean>(initial);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((v) => !v), []);
    return { isOpen, open, close, toggle };
};

export default useDisclosure;


