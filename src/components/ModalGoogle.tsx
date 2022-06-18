import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import { useAuth } from "../hooks/useAuth";

import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/modal.css';

export function ModalGoogle() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [modalIsOpen, setIsOpen] = useState(false);

    const customStylesModalGoogle = {
        content: {
            padding: "30px",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
        },
    };

    const el = document.getElementById("page-auth");
    if (el !== null)
        Modal.setAppElement(el);

    async function changeUser() {
        setIsOpen(state => !state);
        await signInWithGoogle();
        handleCreateRoom();
    }

    // Função chamada quando clicar no botão de criar sala.
    async function handleCreateRoom() {
        navigate("/rooms/new"); // muda de página
    }

    async function openModal() {
        if (!user) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            await signInWithGoogle();
            handleCreateRoom();
        } else {
            setIsOpen(state => !state);
        }
    }

    function closeModal() {
        setIsOpen(state => !state);
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStylesModalGoogle}
            >
                <div className="custom-modal">
                    {/* <img src={timesImg} className="times" alt="Fechar modal" onClick={modalActive} /> */}
                    <span>Continuar com este usuário?</span>
                    <div className="user-info">
                        <img src={user?.avatar} alt={user?.name} referrerPolicy="no-referrer" />
                        <span>{user?.name}</span>
                    </div>
                    <div className="buttons">
                        <button type="button" onClick={handleCreateRoom} className="yes">Sim</button>
                        <button type="button" onClick={changeUser} >Não</button>
                        <button type="button" onClick={closeModal} >Cancelar</button>
                    </div>
                </div>
            </Modal>
            <button onClick={openModal} className="create-room">
                <img src={googleIconImg} alt="Logo do Google" />
                Crie sua sala com o Google
            </button>
        </>
    );
}