import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { patchMe } from "../../apis/user";

type Props = {
    open: boolean;
    onClose: () => void;
    initial?: { name?: string; bio?: string | null};
};

export default function ProfileEditModal({ open, onClose, initial}: Props) {
    const qc = useQueryClient();
    const [name, setName] = useState(initial?.name ?? "");
    const [bio, setBio] = useState(initial?.bio ?? "");
    const [file, setFile] = useState<File | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [open, onClose]);

    useEffect(() => {
        if(open) {
            setName(initial?.name ?? "");
            setBio(initial?.bio ?? "");
            setFile(null);
        }
    }, [open, initial]);

    const mut =useMutation({
        mutationFn: () => patchMe({ name: name || undefined, bio, avatarFile: file ?? undefined}),
        onSuccess: async() => {
            await qc.invalidateQueries({queryKey: ["me"]});
            onClose();
        },
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div
                ref={boxRef}
                className="w-[520px] max-w-[calc(100%-2rem)] rounded-2xl bg-[#2b2f36] p-6 shadow-xl relative"
            >
                <button
                    className="absolute right-4 top-3 text-gray-300 hover:text-white"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold text-white mb-4">
                    프로필 설정
                </h3>
                <div className="space-y-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름(선택)"
                        className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-200 border border-gray-600"
                    />
                    <input
                        value={bio ?? ""}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="소개"
                        className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-200 border border-gray-600"
                    />
                    <input
                        type="file"
                         accept="image/*"
                         onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                         className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-300 border border-gray-600 file:mr-3 file:rounded file:border-0 file:px-3 file:py-1 file:bg-gray-700 file:text-gray-200"
                    />
                    <button
                        onClick={() => mut.mutate()}
                        disabled={mut.isPending}
                        className="w-full rounded-md px-4 py-3 font-semibold bg-pink-600 hover:bg-pink-500 text-white"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}