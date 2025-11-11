import { type FormEvent, useMemo, useState } from "react";
import { postUploadImage } from "../apis/upload";
import useCreateLp from "../hooks/mutations/useCreateLp";

type Props = {
  onDone?: () => void;
};

const LpCreatePage = ({ onDone }: Props) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate: createLp, isPending } = useCreateLp();

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    // 1) 이미지 업로드 → imageUrl 획득
    let imageUrl = "";
    try {
      const uploadRes = await postUploadImage(file, true);
      imageUrl = uploadRes?.data?.imageUrl ?? "";
    } catch (err) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }
    if (!imageUrl) return;

    // 2) 업로드로 받은 imageUrl을 thumbnail로 사용하여 LP 생성
    const payload = {
      title: title.trim(),
      content: title.trim(), // 서버가 content를 요구할 수 있어 최소값으로 전달
      thumbnail: imageUrl,
      published: true,
      tags: [],
    };

    createLp(payload, {
      onSuccess: () => {
        onDone?.();
      },
      onError: (error: unknown) => {
        // 서버가 보내주는 에러 메시지를 최대한 노출
        const msg =
          (error as any)?.response?.data?.message ||
          (error as any)?.message ||
          "LP 생성에 실패했습니다.";
        alert(msg);
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="text-zinc-200 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-md bg-zinc-800 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-zinc-500">미리보기</span>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">LP 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            aria-label="LP 이미지 선택"
            className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200 file:hover:bg-zinc-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="LP 제목을 입력하세요"
          className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!title.trim() || !file || isPending}
          className="h-10 px-4 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-pink-700/50"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default LpCreatePage;
