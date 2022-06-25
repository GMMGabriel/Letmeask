import { toast, Toaster } from 'react-hot-toast';

import copyImg from '../assets/images/copy.svg';

import '../styles/css/room-code.css';

type RoomCodeProps = {
    code: string | undefined;
    withHoverInformation?: boolean;
}

export function RoomCode({ code, withHoverInformation = false, ...props }: RoomCodeProps) {

    function copyRoomCodeClipboard() {
        const roomCode = (code !== undefined) ? code : '---';
        navigator.clipboard.writeText(roomCode);
        toast.success("Código copiado", {
            duration: 1500,
            iconTheme: {
                primary: 'linear-gradient(135deg, #4b5bff, #e559f9)',
                secondary: '#FFF',
            },
            style: {
                borderRadius: '9999px',
                boxShadow: '0 5px 12px rgba(0, 0, 0, 0.4)',
                background: "#f4f0ff",
                color: "#29292e",
            },
        });
    }

    return (
        <>
            <Toaster />
            <button className="room-code" onClick={copyRoomCodeClipboard} >
                <div>
                    <img src={copyImg} alt="Copiar código da sala" />
                </div>
                <span className="code">Sala #{code}</span>
                {withHoverInformation && (
                    <div className="hover-information" >
                        Copiar
                    </div>
                )}
            </button>
        </>
    )
}