import { createContext, useState, useEffect } from 'react';

// 초기값 설정
const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token) => {
    // 백엔드에서 받은 JWT 토큰을 로컬 스토리지에 저장
    localStorage.setItem('token', token);
    setIsLoggedIn(true); // 로그인 상태 업데이트
  };

  const logout = () => {
    setIsLoggedIn(false);
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
