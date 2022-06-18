import { toast, Toaster } from 'react-hot-toast';

import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.css';

type RoomCodeProps = {
    code: string | undefined;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeClipboard() {
        const roomCode = (props.code !== undefined) ? props.code : '---';
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
                background: "#ece6ff",
            },
        });
    }

    function mouseOver() {
        const el = document.getElementById("hover-information");
        if (el !== null) {
            el.classList.add("active");
        }
    }

    function mouseOut() {
        const el = document.getElementById("hover-information");
        if (el !== null) {
            el.classList.remove("active");
        }
    }

    return (
        <>
            <Toaster />
            <button className="room-code" onClick={copyRoomCodeClipboard} onMouseOver={mouseOver} onMouseOut={mouseOut} >
                <div>
                    <img src={copyImg} alt="Copiar código da sala" />
                </div>
                <span className="code">Sala #{props.code}</span>
                <span id="hover-information" >
                    Copiar
                </span>
            </button>
        </>
    )
}