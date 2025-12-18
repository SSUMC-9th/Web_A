import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../apis/auth";
import type { RequestUpdateProfileDto, ResponseMyInfoDto } from "../../src/types/common";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: RequestUpdateProfileDto) =>
      updateProfile(profileData),
    onMutate: async (newProfileData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: ["myInfo"],
      });

      // 이전 값 저장 (롤백용)
      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        "myInfo",
      ]);

      // 낙관적 업데이트: 프로필 정보 즉시 업데이트
      if (previousMyInfo) {
        queryClient.setQueryData<ResponseMyInfoDto>(["myInfo"], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              name: newProfileData.name,
              bio: newProfileData.bio ?? old.data.bio,
            },
          };
        });
      }

      return { previousMyInfo };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousMyInfo) {
        queryClient.setQueryData(["myInfo"], context.previousMyInfo);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: ["myInfo"],
      });
    },
  });
}

