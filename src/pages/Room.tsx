import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import { Database, database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.css';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighligted: boolean;
    isAnswer: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighligted: boolean;
    isAnswer: boolean;
}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();

    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;
    
    useEffect(() => {
        const roomsRef = Database.ref(database, `rooms/${roomId}`);

        Database.onValue(roomsRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighligted: value.isHighligted,
                    isAnswer: value.isAnswer,
                };
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [roomId] // executa cada vez que a roomId mudar
    );

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            toast.error("Digite alguma coisa.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                },
            });
            return;
        }

        if (!user) {
            toast.error("Você precisa logar primeiro.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                },
            });
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighligted: false,
            isAnswer: false,
        };

        const dbRoomsRef = Database.ref(database, `rooms/${roomId}/questions`);
        const dbRoomsPush = Database.push(dbRoomsRef);
        // Fazendo um INSERT no Realtime Database.
        await Database.set(dbRoomsPush, question)
        .then(() => {
            toast.success("Pergunta enviada.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                },
                duration: 3000,
            });
        });

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <Toaster />
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span className="user-needs-to-login">Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
        </div>
    );
}