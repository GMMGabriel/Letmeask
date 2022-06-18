import { FormEvent, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Database, database } from '../services/firebase';

import { Button } from '../components/Button';
import { ModalGoogle } from '../components/ModalGoogle';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.css';
import '../styles/modal.css';

export function Home() {
    const navigate = useNavigate(); // para utilizar navegação entre páginas
    const [roomCode, setRoomCode] = useState('');

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
                }
            });
            return;
        }

        if (dbRoomGet.val().endedAt) {
            toast.error("Essa sala já foi encerrada.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                    background: "#ffcccc",
                }
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
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <ModalGoogle />
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