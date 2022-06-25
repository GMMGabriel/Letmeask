import '../styles/css/empty-area.css';

type EmptyAreaProps = {
    children: string;
}

export function EmptyArea({children, ...props}: EmptyAreaProps) {
    return (
        <span className="empty-area">{children}</span>
    );
}