import { AuthSessionUser } from "@/features/authentication/types/auth.types";
import { isFinanceAdmin, isStoreKeeperAdmin, isSuperAdmin } from "./base";

export function canManageStore(user:AuthSessionUser){
    if(!user) return false
    if(isSuperAdmin(user)) return true
    if(isStoreKeeperAdmin(user)) return true
    if(isFinanceAdmin(user)) return true
    return false
}