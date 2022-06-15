import { useParams, Link, useNavigate } from 'react-router-dom';

import { database, Database } from '../services/firebase';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.css';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();

    const navigate = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await Database.update(Database.ref(database, `rooms/${roomId}`), {
            endedAt: new Date(),
        });
        navigate("/");
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        if (window.confirm('Já respondi essa pergunta.')) {
            await Database.update(Database.ref(database, `rooms/${roomId}/questions/${questionId}`), {
                isAnswered: true,
                isHighlighted: false,
            });
        }
    }

    async function handleHighlightQuestion(questionId: string) {
        await Database.update(Database.ref(database, `rooms/${roomId}/questions/${questionId}`), {
            isHighlighted: true,
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await Database.remove(Database.ref(database, `rooms/${roomId}/questions/${questionId}`));
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/" >
                        <img src={logoImg} alt="Letmeask" />
                    </Link>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

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
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}