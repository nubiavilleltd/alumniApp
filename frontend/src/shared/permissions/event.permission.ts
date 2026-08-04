import { AuthSessionUser } from "@/features/authentication/types/auth.types";
import { isEventAdmin, isSuperAdmin } from "./base";

export function canManageEvents(user:AuthSessionUser){
    if(!user) return false
    if(isSuperAdmin(user)) return true
    if(isEventAdmin(user)) return true
    return false
}