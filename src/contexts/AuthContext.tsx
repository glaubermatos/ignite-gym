import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserDelete, storageGetUser, storageUserSave } from "@storage/storageUser";
import { storageAuthTokenDelete, storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";

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

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingStorageUserData(true)

            await storageUserSave(userData)
            await storageAuthTokenSave(token)
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingStorageUserData(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post("/sessions", {email, password})

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token)
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        }
    }

    async function loadUserData() {
        try {
          setIsLoadingStorageUserData(true)

          const userLogged = await storageGetUser()
          const token = await storageAuthTokenGet()

          if (token && userLogged) {
            userAndTokenUpdate(userLogged, token)
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
            await storageAuthTokenDelete()
            
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