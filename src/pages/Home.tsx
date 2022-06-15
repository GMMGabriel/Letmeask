import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Database, database } from '../services/firebase';

import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.css';

export function Home() {
    const navigate = useNavigate(); // para utilizar navegação entre páginas
    const { user, signInWithGoogle } = useAuth(); // importa o contexto que está na pasta "hooks"
    const [roomCode, setRoomCode] = useState('');

    // Função chamada quando clicar no botão de criar sala.
    async function handleCreateRoom() {
        /**
         * Verifica se já tem um usuário logado, senão tiver, faz o login. Se já tiver, não entra no if e muda de página.
         */
        // eslint-disable-next-line react-hooks/rules-of-hooks
        if (!user) {
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
                    background: "#ffcccc",
                }
            });
            return;
        }

        if (dbRoomGet.val().endedAt) {
            toast.error("Essa sala já foi encerrada.", {
                style: {
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
                    <button onClick={handleCreateRoom} className="create-room">
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