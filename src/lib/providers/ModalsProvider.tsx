import React, { createContext, FC, useCallback, useContext, useEffect, useMemo } from "react";
import { useImmer } from "use-immer";

type UseModalHooks = {
	show: boolean;
	handleHide(): void;
	handleShow(): void;
};

type ModalState = {
	[key: string]: boolean;
}

type ModalProviderHooks = {
	showModal(name: string): void;
	register(name: string): void;
	handleHide(name: string): void;
	getState(name: string): boolean | null;
};

const ModalContext = createContext<ModalProviderHooks>({} as ModalProviderHooks);

const ModalsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
	const [modalState, setModalState] = useImmer<ModalState>({});

	const showModal: ModalProviderHooks["showModal"] = useCallback((name) => {
		setModalState(draft => {
			if (name in draft) {
				draft[name] = true;
			}
		});
	}, [setModalState]);

	const handleHide: ModalProviderHooks["handleHide"] = useCallback((name) => {
		setModalState(draft => {
			if (name in draft) {
				draft[name] = false;
			}
		});
	}, [setModalState]);

	const getState: ModalProviderHooks["getState"] = useCallback((name) => {
		if (name in modalState) {
			return modalState[name];
		}
		return null;
	}, [modalState]);

	const register: ModalProviderHooks["register"] = useCallback((name) => {
		setModalState(draft => {
			if (!(name in draft)) {
				draft[name] = false
			}
		})
	}, [setModalState]);

	const value = useMemo(() => ({
		showModal,
		register,
		handleHide,
		getState,
	}), [
		showModal,
		register,
		handleHide,
		getState,
	]);

	return (
		<ModalContext.Provider value={value}>{ children }</ModalContext.Provider>
	);
};

export function useModal(name: string): UseModalHooks {
	const { showModal, register, handleHide, getState } = useModalContext();

	useEffect(() => {
		register(name);
	}, [name, register]);

	return ({
		show: getState(name) ?? false,
		handleHide: () => handleHide(name),
		handleShow: () => showModal(name),
	});
}

export const useModalContext = () => useContext(ModalContext);
export default ModalsProvider;
