import { create } from "zustand";
import {toast} from 'sonner'
import { authService } from "@/service/authService";
import type { authState } from "@/types/store";
export const useAuthStore = create<authState>((set,get)=>({
  accessToken: null,
  user :null,
  loading : false,

  clearState: async()=>{
    set({
      accessToken:null,
      user:null,
      loading:false
    })
  },

  signUp : async (userName, password, email , firstName , lastName)=>{
    try{
    set({loading:true})
    await authService.signUp(userName, password, email, firstName, lastName)

    toast.success('Đăng kí thành công! bạn sẽ được chuyển đến trang đăng nhập')

    } catch(error){
      console.log(error);
      toast.error(" Đăng kí không thành công ")
      
    } finally{
      set({loading:false})
    }
  },


  signIn : async ( email, password )=>{
    try {
      set({loading:true})
      const {accessToken} = await authService.signIn(email, password) 

      set({
        accessToken: accessToken,
      })

    toast.success('wellcome back')
    } catch (error) {
      console.log(error);
      toast.error('login in error')
    } finally{
      set({loading:false})
    }
  },

  logOut: async()=>{
    try {
      get().clearState()
      await authService.logOut()
      toast.success('Đã đăng xuất')
    } catch (error) {
      console.log(error);
      toast.error("Lỗi Khi Đăng Xuất")
    } 
  }

}
 ))
