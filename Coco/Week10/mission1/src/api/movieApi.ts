import axios from 'axios';
import { Movie, SearchParams } from '../types/movie.types';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// Axios 인스턴스 생성
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

/**
 * 영화 검색
 */
export const searchMovies = async (params: SearchParams): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: params.query,
        include_adult: params.includeAdult,
        language: params.language,
        page: 1,
      },
    });
    
    console.log('✅ 영화 검색 성공:', response.data.results.length, '개');
    return response.data.results;
  } catch (error) {
    console.error('❌ 영화 검색 에러:', error);
    throw new Error('영화 검색에 실패했습니다.');
  }
};

/**
 * 인기 영화 조회 (추가!)
 */
export const getPopularMovies = async (language: string = 'ko-KR'): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: {
        language,
        page: 1,
      },
    });
    
    console.log('✅ 인기 영화 조회 성공:', response.data.results.length, '개');
    return response.data.results;
  } catch (error) {
    console.error('❌ 인기 영화 조회 에러:', error);
    throw new Error('인기 영화를 불러오는데 실패했습니다.');
  }
};

/**
 * 현재 상영중인 영화 조회 (추가!)
 */
export const getNowPlayingMovies = async (language: string = 'ko-KR'): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: {
        language,
        page: 1,
      },
    });
    
    console.log('✅ 현재 상영 영화 조회 성공:', response.data.results.length, '개');
    return response.data.results;
  } catch (error) {
    console.error('❌ 현재 상영 영화 조회 에러:', error);
    throw new Error('현재 상영 영화를 불러오는데 실패했습니다.');
  }
};

/**
 * 최고 평점 영화 조회 (추가!)
 */
export const getTopRatedMovies = async (language: string = 'ko-KR'): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: {
        language,
        page: 1,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('❌ 최고 평점 영화 조회 에러:', error);
    throw new Error('최고 평점 영화를 불러오는데 실패했습니다.');
  }
};

/**
 * 이미지 URL 생성
 */
export const getImageUrl = (
  path: string | null,
  size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string => {
  if (!path) {
    return 'https://via.placeholder.com/500x750?text=No+Image';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdbApi;