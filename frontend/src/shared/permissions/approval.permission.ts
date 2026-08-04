import { AuthSessionUser } from "@/features/authentication/types/auth.types";
import { isApprovalAdmin, isContentAdmin, isSuperAdmin } from "./base";

export function canManageMembers(user:AuthSessionUser){
    if(!user) return false
    if(isSuperAdmin(user)) return true
    if(isApprovalAdmin(user)) return true
    return false
}