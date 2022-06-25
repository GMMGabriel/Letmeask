import { FormEvent, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Database, database } from '../services/firebase';

import { useAuth } from "../hooks/useAuth";

import { UserView } from '../components/UserView';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.css';

export function Home() {
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate(); // para utilizar navegação entre páginas
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            await signInWithGoogle();
        }
        navigate("/rooms/new"); // muda de página
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const dbRoomRef = Database.ref(database, `rooms/${roomCode}`);
        const dbRoomGet = await Database.get(dbRoomRef); // pega no banco
        // console.log(dbRoomGet.hasChildren());
        if (!dbRoomGet.hasChildren()) { // Verifica se não tem itens no roomCode
            // alert("Essa sala não existe.");
            toast.error("Essa sala não existe.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                    background: "#ffcccc",
                    color: "#29292e",
                },
            });
            return;
        }

        if (dbRoomGet.val().endedAt) {
            toast.error("Essa sala já foi encerrada.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                    background: "#ffcccc",
                    color: "#29292e",
                },
            });
            return;
        }

        navigate('/rooms/' + roomCode); // permite a entrada para a sala no código informado
    }

    return (
        <div id="page-auth">
            <Toaster />
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="settings">
                    <UserView />
                    {/* <Theme /> */}
                </div>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit" disabled={roomCode.trim() === ''}>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}