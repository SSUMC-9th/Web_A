import React from 'react';

interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = '오류가 발생했습니다.' }) => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium text-lg">{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage;
