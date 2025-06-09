import LoginForm from "../ui/LoginForm";
export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}