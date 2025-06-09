import Link from 'next/link';

export default function EmailVerificationPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                <p className="text-gray-700 mb-4">
                    Please check your email for a verification link. Click the link to verify your email address.
                </p>
                <p className="text-gray-500 text-sm">
                    If you didn't receive the email, please check your spam folder or request a new verification email.
                </p>
            </div>
            <Link href="/login" className="mt-4 text-blue-500 hover:underline">
                Go to Login
            </Link>
        </div>
    );
}