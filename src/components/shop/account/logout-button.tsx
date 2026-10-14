import { logoutAction } from "@/lib/actions/auth.actions"

export function LogoutButton(){
    return(
        <form action={logoutAction} className="w-full">
            <button type="submit" className="w-full text-left">
            Log out
            </button>
        </form>
    )
}