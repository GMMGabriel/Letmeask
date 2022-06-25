import { ReactNode } from 'react';

import cx from 'classnames';

import '../styles/css/question.css';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    isAnswered?: boolean;
    isHighlighted?: boolean;
    children?: ReactNode;
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHighlighted = false,
    children,
}: QuestionProps) {
    return (
        <div className={cx(
            'question',
            { answered: isAnswered },
            { highlighted: isHighlighted && !isAnswered },
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} referrerPolicy="no-referrer" />
                    <span>{author.name}</span>
                </div>
                {children && (
                    <div className="admin-buttons">
                        {children}
                    </div>
                )}
            </footer>
        </div>
    );
}