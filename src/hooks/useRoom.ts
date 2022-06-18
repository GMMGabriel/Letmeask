import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const questionsQuery = Database.query(questionsRef, Database.orderByChild(`isAnswered`));

        Database.onValue(questionsQuery, (room) => {
            const databaseRoom = room.val();
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

            // // Ordena as perguntas para que fiquem em primeiro aquelas com mais likes.
            // if (parsedQuestions !== undefined) {
            //     parsedQuestions = parsedQuestions.sort((a, b) => {
            //         if (!a.isAnswered && b.isAnswered) {
            //             return -5;
            //         } else {
            //             if (a.likeCount > b.likeCount) {
            //                 return -2;
            //             } else {
            //                 return 2;
            //             }
            //         }
            //     })
            // }

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);

            document.title = "Letmeask | sala: " + databaseRoom.title;
        });

        return () => {
            Database.off(questionsRef);
        }
    }, [roomId, user?.id, navigate] // executa cada vez que a roomId mudar
    );
    return { questions, title };
}