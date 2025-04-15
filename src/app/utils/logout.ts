
export const logout = () => {
  localStorage.removeItem("maLoaiNguoiDung");
  localStorage.removeItem("role");
  localStorage.removeItem("accessToken"); 
};
