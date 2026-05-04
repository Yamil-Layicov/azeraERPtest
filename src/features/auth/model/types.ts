import type { BackendResponse } from '@/shared/types/api';
import type { User } from '@/entities/user/model/types';
import type { NavigationData } from '@/shared/types/navigation';

export interface LoginPayload {
  username: string;
  password?: string;
  rememberMe: boolean;
}

export type LoginResponse = BackendResponse<void>; 

export interface AuthMeData {
  user: User;                          
  navigation?: NavigationData | null;  
  nodes: any | null;                   
}


export type MeResponse = BackendResponse<AuthMeData>;