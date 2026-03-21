
import type { themeState } from "@/types/store";
import {create} from "zustand"
import { persist } from "zustand/middleware";

export const useThemeStore = create<themeState>()(
persist(
    (set,get)=>({

        isDarkMode: false,

       toggleTheme: () => {
        const newValue = !get().isDarkMode;
        set({ isDarkMode: newValue });
        if(newValue){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
       },
       setTheme: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        if(isDark){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
       },

      
    }
    ),{
        name: "theme-storage",
    }
)
)