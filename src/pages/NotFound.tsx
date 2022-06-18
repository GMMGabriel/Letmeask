import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import '../styles/not-found.css';

export function NotFound() {
    const location = useLocation();

    console.log(location);
    
    return(
        <div className="not-found">
            <main>
                <img src={logoImg} alt="Letmeask" />
                <h1>404</h1>
                <p>{`${location.pathname}${location.search}`}</p>
                <Link to="/">Voltar a página inicial</Link>
            </main>
        </div>
    );
}