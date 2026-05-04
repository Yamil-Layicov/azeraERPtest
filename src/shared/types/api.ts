export interface BackendResponse<T = void> {
  version: string;             
  isSuccess: boolean;          
  errorCode: string | null;   
  errorMessage: string | null; 
  data?: T;                    
}