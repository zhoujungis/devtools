import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success'|'error'|'warning'|'info'
export interface ToastItem { id:number; message:string; type:ToastType; duration:number }

let nid=0
export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])
  function show(message:string, type:ToastType='success', duration=2500){
    const id=++nid
    toasts.value.push({id,message,type,duration})
    setTimeout(()=> dismiss(id), duration)
  }
  function dismiss(id:number){ toasts.value = toasts.value.filter(t=>t.id!==id) }
  return { toasts, show, dismiss }
})
