import UseCallbackPage from './UseCallbackPage';
import UseMemoPage from './UseMemoPage';
import './App.css';

export default function App() {
    return (
        <main className='min-h-screen bg-neutral-950 text-neutral-100 flex flex-col gap-4 items-center justify-center'>
            <UseCallbackPage />
            <UseMemoPage />
        </main>
    );
}