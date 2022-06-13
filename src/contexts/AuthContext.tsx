import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, Auth } from "../services/firebase";

type User = { // tipo do usuário
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = { // tipo do contexto do usuário
    user: User | undefined; // pode ter o tipo de um User ou undefined quando nenhum usuário está logado
    signInWithGoogle: () => Promise<void>; // quando uma função é assincrona, ela sempre devolve uma Promise (neste caso, void)
}

type AuthContextProviderProps = {
    children: ReactNode
}

// Criando um contexto do tipo AuthContextType
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    // O tipo desse estado é do tipo User.
    const [user, setUser] = useState<User>();
  
    // Utilizando useEffect:
    useEffect(() => {
      const unsubscribe = Auth.onAuthStateChanged(auth, user => {
        if (user) {
          const { displayName, photoURL, uid } = user;
  
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Acount.');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          });
        }
      });
  
      // Sempre que é declarado um eventListener, é obrigatório se "descadastrar" desse evento no final do useEffect. (essa é uma boa prática)
      return () => {
        unsubscribe();
      }
    }, []);
  
    async function signInWithGoogle() {
      const provider = new Auth.GoogleAuthProvider();
      const result = await Auth.signInWithPopup(auth, provider)
  
      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
  
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Acount.');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
    }
    
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}