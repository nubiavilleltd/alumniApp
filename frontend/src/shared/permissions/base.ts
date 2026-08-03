import { AuthSessionUser } from "@/features/authentication/types/auth.types";

export function isSuperAdmin(user:AuthSessionUser){
    return user.role == "super admin"
}
export function isFinanceAdmin(user:AuthSessionUser){
    return user.role == "finance admin"
}
export function isContentAdmin(user:AuthSessionUser){
    return user.role == "content admin"
}
export function isEventAdmin(user:AuthSessionUser){
    return user.role == "event admin"
}
export function isApprovalAdmin(user:AuthSessionUser){
    return user.role == "approval admin"
}
export function isStoreKeeperAdmin(user:AuthSessionUser){
    return user.role == "storekeeper admin"
}