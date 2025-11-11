import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useProfileMutations';

export const MyPage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('bio', bio);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    updateProfile(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              설정
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로필 사진 (선택)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-full"
                />
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (선택)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="자기소개를 입력하세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isPending ? '저장 중...' : '저장'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNickname(user.nickname);
                  setBio(user.bio || '');
                }}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">이메일</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">닉네임</label>
              <p className="text-lg">{user.nickname}</p>
            </div>
            {user.bio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-lg">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};