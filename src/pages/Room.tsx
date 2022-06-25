import { FormEvent, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

import { Database, database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { UserView } from '../components/UserView';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { EmptyArea } from '../components/EmptyArea';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.css';

type RoomParams = {
    id: string;
}

export function Room() {
    const { user, signInWithGoogle } = useAuth();

    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function loginUser() {
        if (!user) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            await signInWithGoogle();
        }
    }

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            toast.error("Digite alguma coisa.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                    background: "#ffcccc",
                    color: "#29292e",
                },
            });
            return;
        }

        if (!user) {
            toast.error("Você precisa logar primeiro.", {
                style: {
                    borderRadius: '9999px',
                    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                    background: "#ffcccc",
                    color: "#29292e",
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
            isHighlighted: false,
            isAnswered: false,
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
                        background: "#f4f0ff",
                        color: "#29292e",
                    },
                    iconTheme: {
                        primary: 'linear-gradient(135deg, #4b5bff, #e559f9)',
                        secondary: '#FFF',
                    },
                    duration: 3000,
                });
            });

        setNewQuestion('');
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            await Database.remove(Database.ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`));
        } else {
            const dbPush = Database.push(Database.ref(database, `rooms/${roomId}/questions/${questionId}/likes`));
            await Database.set(dbPush, {
                authorId: user?.id
            })
        }
    }

    return (
        <div id="page-room">
            <Toaster />
            <header>
                <div className="content">
                    <div className="logo-and-user">
                        <Link to="/" >
                            <img src={logoImg} alt="Letmeask" />
                        </Link>
                        <UserView />
                        {/* <Theme /> */}
                    </div>
                    <RoomCode code={roomId} withHoverInformation />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1><span>Sala:</span> {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span className="user-needs-to-login">Para enviar uma pergunta, <button form='' onClick={loginUser}>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user || newQuestion.trim() === ''}>Enviar pergunta</Button>
                    </div>
                </form>

                {questions.length > 0 ? (
                    <div className="question-list">
                        {questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered && (
                                        <button
                                            className={`like-button ${question.likeId ? 'liked' : ''}`}
                                            type="button"
                                            aria-label="Marcar como gostei"
                                            onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                        >
                                            {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </Question>
                            )
                        })}
                    </div>
                ) : (
                    <EmptyArea>Sem perguntas</EmptyArea>
                )}
            </main>
        </div>
    );
}