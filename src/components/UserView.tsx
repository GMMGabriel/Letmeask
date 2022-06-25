import { FormEvent, useState } from 'react';
import Modal from 'react-modal';

import { useAuth } from "../hooks/useAuth";

import userOffImg from '../assets/images/user-off.svg';

import '../styles/css/user-view.css';

export function UserView() {
    const { user, signInWithGoogle, signOutGoogle } = useAuth();
    const [modalIsOpen, setIsOpen] = useState(false);

    const customStylesModal = {
        content: {
            padding: "30px",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
        },
    };

    const el = document.getElementById("page-room");
    if (el !== null)
        Modal.setAppElement(el);

    async function openModal(event: FormEvent) {
        event.preventDefault();
        if (!user) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            await signInWithGoogle();
        } else {
            setIsOpen(state => !state);
        }
    }

    function closeModal() {
        setIsOpen(state => !state);
    }

    function logout() {
        signOutGoogle();
        closeModal();
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStylesModal}
            >
                <div className="custom-modal">
                    {/* <img src={timesImg} className="times" alt="Fechar modal" onClick={modalActive} /> */}
                    <span>Fazer logout?</span>
                    <div className="user-info">
                        <img src={user?.avatar} alt={user?.name} referrerPolicy="no-referrer" />
                        <span>{user?.name}</span>
                    </div>
                    <div className="buttons">
                        <button type="button" onClick={logout} className="yes">Sim</button>
                        <button type="button" onClick={closeModal} >Não</button>
                    </div>
                </div>
            </Modal>
            <div className="user-view">
                {!user ? (
                    <img src={userOffImg} onClick={openModal} alt="Imagem que representa que nenhum usuário está logado" />
                ) : (
                    <>
                        <img src={user?.avatar} alt={user?.name} onClick={openModal} referrerPolicy="no-referrer" />
                    </>
                )}
            </div>
        </>
    );
}