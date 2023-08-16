import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserDelete, storageGetUser, storageUserSave } from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO,
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingStorageUserData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type Props = {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingStorageUserData, setIsLoadingStorageUserData] = useState(false)

    useEffect(() => {
        loadUserData()
    }, [])

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post("/sessions", {email, password})

            if (data.user) {
                setUser(data.user)
                storageUserSave(data.user)
            }
        } catch (error) {
            throw error
        }
    }

    async function loadUserData() {
        try {
          setIsLoadingStorageUserData(true)
          const userLogged = await storageGetUser()

          if (userLogged) {
            setUser(userLogged)
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingStorageUserData(false)
        }
    }

    async function signOut() {
        try {
            setIsLoadingStorageUserData(true)

            setUser({} as UserDTO)
            await storageUserDelete()
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingStorageUserData(false)
        }
    }

    return (
        <AuthContext.Provider value={{
          user,
          signIn,
          signOut,
          isLoadingStorageUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
}