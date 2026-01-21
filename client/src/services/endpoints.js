export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    CREATE_USER: '/auth/create-user',
  },
  USERS: {
    GET_ALL: '/user',
    GET_BY_ID: (id) => `/user/${id}`,
    UPDATE: (id) => `/user/update/${id}`,
    DELETE: (id) => `/user/delete/${id}`,
  },
  PATIENTS: {
    GET_ALL: '/patients',
    CREATE: '/patients',
    GET_BY_ID: (id) => `/patients/${id}`,
    UPDATE: (id) => `/patients/update/${id}`,
    DELETE: (id) => `/patients/delete/${id}`,
  },
  DOCTORS: {
    GET_ALL: '/doctors',
    CREATE: '/doctors',
    GET_BY_ID: (id) => `/doctors/${id}`,
    UPDATE: (id) => `/doctors/update/${id}`,
    DELETE: (id) => `/doctors/delete/${id}`,
  },
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    CREATE: '/appointments',
    GET_BY_ID: (id) => `/appointments/${id}`,
    UPDATE: (id) => `/appointments/update/${id}`,
    DELETE: (id) => `/appointments/delete/${id}`,
  },
  BILLINGS: {
    GET_ALL: '/billings',
    CREATE: '/billings',
    GET_BY_ID: (id) => `/billings/${id}`,
    UPDATE: (id) => `/billings/update/${id}`,
    DELETE: (id) => `/billings/delete/${id}`,
  },
};