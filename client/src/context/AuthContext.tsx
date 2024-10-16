import { createContext, useState, useEffect, ReactNode } from 'react';

// 로그인 상태와 로그인/로그아웃 함수를 포함하는 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 초기값 설정
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    // 백엔드에서 받은 JWT 토큰을 로컬 스토리지에 저장
    localStorage.setItem('token', token);
    setIsLoggedIn(true);  // 로그인 상태 업데이트
  };

  const logout = () => {
    setIsLoggedIn(false);
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
