import PasswordResetForm from "../ui/PasswordResetForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
                <PasswordResetForm />
            </div>
        </div>
    );
}