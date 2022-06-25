import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

import { database, Database } from "../services/firebase";

import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string | undefined) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const questionsRef = Database.ref(database, `rooms/${roomId}`);

        Database.onValue(questionsRef, (room) => {
            const databaseRoom = room.val();
            const endedAt = databaseRoom.endedAt;

            if (endedAt) {
                toast.error("Essa sala já foi encerrada.", {
                    style: {
                        borderRadius: '9999px',
                        boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                        background: "#ffcccc",
                        color: "#29292e",
                    },
                });
                navigate("/");
            }

            const authorId = databaseRoom.authorId;

            if (authorId !== user?.id) {
                navigate(`/rooms/${roomId}`);
            }

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            let parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                };
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });

        return () => {
            Database.off(questionsRef);
        }
    }, [roomId, user?.id] // executa cada vez que a roomId mudar
    );
    return { questions, title };
}