import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.css';

type RoomCodeProps = {
    code: string | undefined;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeClipboard() {
        let roomCode = '---';
        if (props.code !== undefined){
            roomCode = props.code;
        }
        navigator.clipboard.writeText(roomCode);
    }
    
    return (
        <button className="room-code" onClick={copyRoomCodeClipboard}>
            <div>
                <img src={copyImg} alt="Copiar código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}