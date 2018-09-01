// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('antd-pro-authority');
}

export function setAuthority(authority) {
  return sessionStorage.setItem('antd-pro-authority', authority);
}

export function setUser(data) {
  sessionStorage.setItem('antd-pro-authority', data.user.currentAuthority);
  sessionStorage.setItem('current-user', JSON.stringify(data.user));
    sessionStorage.setItem('current-menu',JSON.stringify(data.menus));
}

export function getCurrentUser() {
    let user = sessionStorage.getItem('current-user');
    return JSON.parse(user);
}
export function getCurrentMenu() {
    const menu = sessionStorage.getItem('current-menu');
        if(menu){
           return JSON.parse(menu);
        }
    return;
}
