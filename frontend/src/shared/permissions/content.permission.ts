import { AuthSessionUser } from "@/features/authentication/types/auth.types";
import { isContentAdmin, isSuperAdmin } from "./base";

export function canManageContent(user:AuthSessionUser){
    if(!user) return false
    if(isSuperAdmin(user)) return true
    if(isContentAdmin(user)) return true
    return false
}