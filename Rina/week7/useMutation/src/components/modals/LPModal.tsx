import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { QUERY_KEY } from "../../constants/key";
import { createLp, updateLp, type CreateLpBody } from "../../apis/lp";
import { uploadImage } from "../../apis/uploads";
import lpDefaultImage from "../../assets/image/image-lp.jpg"

type Props = {
    open: boolean;
    onClose: () => void;
    // 수정모드 옵션
    editTargetId?: number;
    initial?: {title: string; content: string; tags: string[]; thumbnail?: string | null };
};

export default function LPModal({open, onClose, editTargetId, initial}: Props) {
    const qc = useQueryClient();
    const [title, setTitle] = useState(initial?.title ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial?.thumbnail ?? null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const isEdit = !!editTargetId;
    useEffect(() => {
        if (!open) return;
        const handler = (e : MouseEvent) => {
            if (!dialogRef.current) return;
            if (!dialogRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            setTitle(initial?.title ?? "");
            setContent(initial?.content ?? "");
            setTags(initial?.tags ?? []);
            setTagInput("");
            setFile(null);
            setThumbnailUrl(initial?.thumbnail ?? null);
        }
    }, [open, initial]);

    const addTag = () => {
        const t = tagInput.trim();
        if (!t || tags.includes(t)) return;
        setTags((prev) => [...prev, t]);
        setTagInput("");
    };
    const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t))

    const invalidateLpLists = async () => {
        await qc.invalidateQueries({ queryKey : [QUERY_KEY.lps]});
    };

    const createMuta = useMutation({
        mutationFn: async() => {
            let url = thumbnailUrl;
            if (file) url = await uploadImage(file, false);
            const payload: CreateLpBody = {
                title: title.trim(),
                content: content.trim(),
                thumbnail: url ?? undefined,
                tags,
                published: true,
            };
            return createLp(payload);
        },
        onSuccess: async () => {
            await invalidateLpLists();
            onClose();
        },
    });

    const editMuta = useMutation({
        mutationFn: async () => {
            let url = thumbnailUrl;
            if (file) url = await uploadImage(file, false);
            const payload: Partial<CreateLpBody> = {
                title: title.trim(),
                content: content.trim(),
                thumbnail: url ?? null,
                tags,
            };
            return updateLp(editTargetId!, payload);
        },
        onSuccess: async () => {
            await invalidateLpLists();
            // 상세 페이지 캐시도 무효화
            await qc.invalidateQueries({ queryKey: ["lp", editTargetId]});
            onClose();
        },
    });
    
    const disabled = title.trim().length < 1 || content.trim().length < 1 || createMuta.isPending || editMuta.isPending;

    const submit = () => (isEdit ? editMuta.mutate() : createMuta.mutate());

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div ref={dialogRef} className="w-[560px] max-w-[calc(100%-2rem)] rounded-2xl bg-[#2b2f36] p-6 shadow-xl relative">
                <button
                    aria-label="close"
                    onClick={onClose}
                    className="absolute right-4 top-3 text-gray-300 hover:text-white cursor-pointer"
                >
                    ✕
                </button>

                <div className="flex items-center justify-center mb-5">
                    <img
                        src={thumbnailUrl || lpDefaultImage}
                        alt="LP"
                        className="w-36 h-36 object-contain opacity-90"
                    />
                </div>

                <div className="space-y-3">
                    <input
                        className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-200 outline-none border border-gray-600 focus:border-gray-400"
                        placeholder="LP Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-200 outline-none border border-gray-600 focus:border-gray-400"
                        placeholder="LP Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 파일 */}
                <input
                    type="file"
                    accept="image/"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-md bg-[#1f2328] px-3 py-2 text-gray-300 outline-none border border-gray-600 file:mr-3 file:rounded file:border-0 file:px-3 file:py-1 file:bg-gray-700 file:text-gray-200"
                />

                <div className="flex gap-2">
                    <input
                        className="flex-1 rounded-md bg-[#1f2328] px-3 py-2 text-gray-200 outline-none border border-gray-600 focus:border-gray-400" 
                        placeholder="LP Tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault(); addTag();}}}
                    />
                    <button
                        type="button"
                        onClick={addTag}
                        className="px-4 rounded-md bg-gray-400 text-gray-900 hover:bg-white"
                    >
                        Add
                    </button>
                </div>

                {/* 태그 칩들 */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-2 py-1 text-sm"
                            >
                                {t}
                                <button
                                    onClick={() => removeTag(t)}
                                    className="text-gray-300 hover:text-white cursor-pointer"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <button
                    disabled={disabled}
                    onClick={submit}
                    className={`mt-3 w-full rounded-md px-4 py-3 font-semibold cursor-pointer ${disabled ? "bg-gray-500 text-gray-300" : "bg-pink-600 hover:bg-pink-500 text-white"}`}
                >
                    {isEdit ? "저장" : "추가"}
                </button>
            </div>
        </div>
    )
}