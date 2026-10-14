    import { LoginForm } from "@/components/auth/login-form"
    interface PageProps {
        searchParams: Promise<{
            redirectTo?: string 
        }>
    }

    export default async function LoginPage(
        {searchParams}: PageProps
    ){
        const { redirectTo } = await searchParams
        return <LoginForm redirectTo={redirectTo ?? "/"}/>
    }