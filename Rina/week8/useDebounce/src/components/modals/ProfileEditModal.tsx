import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { patchMe } from "../../apis/user";
type Props = {
    open: boolean;
    onClose: () => void;
    initial?: { name?: string; bio?: string | null; avatar?: string | null };
    onSaved?: (patch: {name?: string; bio?: string | null; avatar?: string | null}) => void;
};

export default function ProfileEditModal({ open, onClose, initial, onSaved}: Props) {
    const qc = useQueryClient();
    const [name, setName] = useState(initial?.name ?? "");
    const [bio, setBio] = useState(initial?.bio ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.avatar ?? null);
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
            setPreview(initial?.avatar ?? null);
        }
    }, [open, initial]);

    const mut =useMutation({
        mutationFn: () => patchMe({ name: name || undefined, bio, avatarFile: file ?? undefined}),
        // 낙관적 업뎃
        onSuccess: () => {
            onSaved?.({ name, bio, avatar: preview ?? null });
            onClose();
            // await qc.cancelQueries({ queryKey: ["me"]});
            // const prev = qc.getQueryData<MeData>(["me"]);

            // // me 캐시 즉시 닉네임 변경ㅇ
            // if (prev) {
            //     const next = { ...prev, name: name?.trim() ?? prev.name };
            //     qc.setQueryData<MeData>(["me"], next);
            // }

            // window.dispatchEvent(
            //     new CustomEvent<NicknameUpdateDetail>("me:nickname:update", {
            //         detail: {name: name?.trim() ?? null},
            //     })
            // );
            // return {prev};
        },

        onError: () => {
            // if (ctx?.prev) qc.setQueryData<MeData>(["me"], ctx.prev);
            //     const prevName = ctx?.prev?.name ?? null;
            //     window.dispatchEvent(
            //     new CustomEvent<NicknameUpdateDetail>("me:nickname:update", {
            //         detail: { name: prevName },
            //     })
            // );
            alert("프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.")
        },

        onSettled: async() => await qc.invalidateQueries({queryKey:["me"]}),

    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mut.mutate();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl border border-slate-700"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-100">
                        프로필 수정
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-white cursor-pointer"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* 아바타 프리뷰 */}
                <div className="flex flex-col items-center mb-4 gap-2">
                    <div>
                        {preview ? (
                            <img src={preview} alt="avatar preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                         accept="image/*"
                         onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setFile(f);
                            if (f) {
                                const url = URL.createObjectURL(f);
                                setPreview(url);
                            }
                            else {
                                setPreview(initial?.avatar ?? null);
                            }
                         }}
                         className="text-xs text-gray-300"
                    />
                </div>

                {/* 이름 */}
                <label className="block mb-3">
                    <span className="block text-sm text-gray-300 mb-1">이름</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md bg-slate-800 px-3 py-2 text-gray-100 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm text-gray-300 mb-1">소개</span>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full rounded-md bg-slate-800 px-3 py-2 text-gray-100 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                    />
                </label>

                <button
                    type="submit"
                    disabled={mut.isPending}
                    className={`w-full rounded-lg py-2.5 font-semibold ${
                        mut.isPending ? "bg-slate-700 text-gray-400"
                            : "bg-pink-600 hover:bg-pink-500 text-white"
                    } transition`}
                >
                    {mut.isPending ? "저장 중..." : "저장"}
                </button>
                
            </form>
            
        </div>
    );
}