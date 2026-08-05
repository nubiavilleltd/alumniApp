import { AuthSessionUser } from "@/features/authentication/types/auth.types";

export function isSuperAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "super admin"
}
export function isFinanceAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "finance admin"
}
export function isContentAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "content admin"
}
export function isEventAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "event admin"
}
export function isApprovalAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "approval admin"
}
export function isStoreKeeperAdmin(user:AuthSessionUser | null){
    if(!user) return "alumni"
    return user.role == "storekeeper admin"
}