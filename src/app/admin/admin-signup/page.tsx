import SignupForm from "@/app/ui/SignupForm";
export default function AdminSignupPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <SignupForm />
            </div>
        </div>
    );
}