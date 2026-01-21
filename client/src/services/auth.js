import api from './api';

export async function login(credentials){
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function logout(){
  await api.post('/auth/logout');
}
