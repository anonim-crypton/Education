const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    school_name?: string;
  };
  access: string;
  refresh: string | null;
  is_teacher?: boolean;
  teacher_status?: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  school_name: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    school_name?: string;
  };
  access: string;
  refresh: string | null;
}

export interface ApiError {
  success: boolean;
  errors: Record<string, string[]>;
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const apiUrl = `${API_BASE_URL}/api/users/login/`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = { detail: await response.text() };
    }

    if (!response.ok) {
      // Log error response structurally
      if (typeof window !== 'undefined') {
        const errorMsg = JSON.stringify({
          status: response.status,
          data: data
        }, null, 2);
        console.warn('BACKEND ERROR:', errorMsg);
      }
      throw data;
    }

    return data;
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('LOGIN EXCEPTION:', JSON.stringify(error, null, 2));
    }
    throw error;
  }
};

export const register = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/users/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  clearTokens();
  return data;
};

export const storeTokens = (access: string, refresh: string | null) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const googleLogin = async (token: string, schoolName?: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/google/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      school_name: schoolName || 'Not specified',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const googleRegister = async (
  token: string,
  schoolName: string
): Promise<RegisterResponse> => {
  const apiUrl = `${API_BASE_URL}/api/users/google/`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        school_name: schoolName || 'Not specified',
      }),
    });

    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = { detail: await response.text() };
    }

    if (!response.ok) {
      if (typeof window !== 'undefined') {
        console.warn('GOOGLE REGISTER ERROR:', JSON.stringify({
          status: response.status,
          data: data
        }, null, 2));
      }
      throw data;
    }

    return data as RegisterResponse;
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('GOOGLE REGISTER EXCEPTION:', JSON.stringify(error, null, 2));
    }
    throw error;
  }
};
