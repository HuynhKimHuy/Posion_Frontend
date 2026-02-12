import type  { User } from "./user"
export interface authState {
    accessToken : string | null,
    user: User | null,
    loading: boolean,
    signUp: (userName: string, password:string, email: string, firstName : string , lastName : string) => Promise <void>
    
    signIn: (email: string, password: string) => Promise <void>

    clearState:()=>void

    logOut:()=>Promise<void>
}

