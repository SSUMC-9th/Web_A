import React, { useState, useEffect } from "react";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import type { ResponseMyInfoDto } from "../src/types/common";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: ResponseMyInfoDto["data"];
  onUpdateSuccess: () => void;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  userInfo,
  onUpdateSuccess,
}: ProfileEditModalProps) => {
  const [name, setName] = useState(userInfo.name);
  const [bio, setBio] = useState(userInfo.bio || "");

  const { mutateAsync: updateProfileMutation, isPending } = useUpdateProfile();

  useEffect(() => {
    if (isOpen) {
      setName(userInfo.name);
      setBio(userInfo.bio || "");
    }
  }, [isOpen, userInfo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      const profileData = {
        name: name.trim(),
        ...(bio.trim() && { bio: bio.trim() }),
      };

      await updateProfileMutation(profileData);
      onUpdateSuccess();
      onClose();
    } catch (error: any) {
      console.error("프로필 수정 에러:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "프로필 수정에 실패했습니다.";
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-white"
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-bold">프로필 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Bio (선택사항)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              className="h-20 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="text-sm text-gray-400">
            <p>이메일: {userInfo.email}</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              disabled={isPending}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

