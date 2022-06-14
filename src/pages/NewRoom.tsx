import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { database, Database } from '../services/firebase';

// import '../styles/auth.css';

export function NewRoom() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Criando um estado para o valor do input de nova sala.
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if (newRoom.trim() === '')
            return;

        const dbRoomsRef = Database.ref(database, 'rooms');
        const dbRoomsPush = Database.push(dbRoomsRef);
        // Fazendo um INSERT no Realtime Database.
        await Database.set(dbRoomsPush, {
            title: newRoom,
            authorId: user?.id
        })
        .then(() => {
            console.log("\"set\" finalizado!");
        });
        navigate(`/rooms/${dbRoomsPush.key}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}