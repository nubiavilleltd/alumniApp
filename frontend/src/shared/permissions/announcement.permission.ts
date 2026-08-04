import { AuthSessionUser } from "@/features/authentication/types/auth.types";
import { isContentAdmin, isEventAdmin, isSuperAdmin } from "./base";

export function canManageAnnouncements(user:AuthSessionUser){
    if(!user) return false
    if(isSuperAdmin(user)) return true
    if(isEventAdmin(user)) return true
    if(isContentAdmin(user)) return true
    return false
}